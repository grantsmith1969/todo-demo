using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TodoDemo.Data;

var builder = WebApplication.CreateBuilder(args);

var defaultOrigins = new[] { "http://localhost:3000", "http://localhost:4173", "http://localhost:5173" };
var configuredOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
var allowedOrigins = (configuredOrigins is { Length: > 0 }) ? configuredOrigins : defaultOrigins;

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

ConfigureDbContexts(builder.Services, builder.Configuration);

builder.Services
    .AddGraphQLServer()
    .AddQueryType(d => d.Name("Query"))
    .AddTypeExtension<TodoDemo.GraphQL.TaskQueries>()
    .AddMutationType(d => d.Name("Mutation"))
    .AddTypeExtension<TodoDemo.GraphQL.TaskMutations>()
    .AddSubscriptionType(d => d.Name("Subscription"))
    .AddTypeExtension<TodoDemo.GraphQL.TaskSubscriptions>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddInMemorySubscriptions();

var app = builder.Build();

await InitializeDatabaseAsync(app.Services, app.Logger);

app.UseWebSockets();
app.UseRouting();
app.UseCors();

app.MapGraphQL();
app.MapGet("/", () => Results.Redirect("/graphql"));

app.Run();

static void ConfigureDbContexts(IServiceCollection services, IConfiguration configuration)
{
    services.AddDbContextFactory<TaskDbContext>((_, options) =>
    {
        ConfigureProvider(options, configuration);
    });
}

static void ConfigureProvider(DbContextOptionsBuilder options, IConfiguration configuration)
{
    var provider = configuration.GetValue<string>("DatabaseProvider") ?? "sqlite";
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (string.Equals(provider, "sqlserver", StringComparison.OrdinalIgnoreCase))
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("The SQL Server connection string 'ConnectionStrings:DefaultConnection' is not configured.");
        }

        options.UseSqlServer(connectionString, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure();
        });
    }
    else
    {
        var sqliteConnectionString = string.IsNullOrWhiteSpace(connectionString)
            ? "Data Source=tasks.db"
            : connectionString;

        options.UseSqlite(sqliteConnectionString);
    }
}

static async Task InitializeDatabaseAsync(IServiceProvider services, ILogger logger, CancellationToken cancellationToken = default)
{
    using var scope = services.CreateScope();
    var scopedProvider = scope.ServiceProvider;
    var contextFactory = scopedProvider.GetRequiredService<IDbContextFactory<TaskDbContext>>();

    const int maxAttempts = 5;

    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            await using var dbContext = await contextFactory.CreateDbContextAsync(cancellationToken);
            await dbContext.Database.EnsureCreatedAsync(cancellationToken);
            return;
        }
        catch (Exception ex)
        {
            if (attempt == maxAttempts)
            {
                logger.LogError(ex, "Failed to initialize the database after {AttemptCount} attempts.", attempt);
                throw;
            }

            var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
            logger.LogWarning(ex, "Database initialization attempt {Attempt} of {MaxAttempts} failed. Retrying in {DelaySeconds} seconds...", attempt, maxAttempts, delay.TotalSeconds);
            await Task.Delay(delay, cancellationToken);
        }
    }
}
