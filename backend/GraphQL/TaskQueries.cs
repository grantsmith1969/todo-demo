using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using TodoDemo.Data;
using TodoDemo.Models;

namespace TodoDemo.GraphQL;

[ExtendObjectType(OperationTypeNames.Query)]
public sealed class TaskQueries
{
    [GraphQLName("getAllTasks")]
    public async Task<IReadOnlyList<TaskItem>> GetAllTasks(
        [Service] IDbContextFactory<TaskDbContext> contextFactory,
        CancellationToken cancellationToken)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.Tasks
            .AsNoTracking()
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
