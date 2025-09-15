using Microsoft.EntityFrameworkCore;
using TodoDemo.Models;
using TaskStatusEnum = TodoDemo.Models.TaskStatus;

namespace TodoDemo.Data;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(task => task.Id);

            entity.Property(task => task.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(task => task.Description)
                  .HasMaxLength(2000);

            entity.Property(task => task.Status)
                  .HasConversion<string>()
                  .HasMaxLength(32)
                  .HasDefaultValue(TaskStatusEnum.Pending);

            entity.Property(task => task.CreatedAt)
                  .IsRequired();

            entity.Property(task => task.UpdatedAt);
        });
    }
}
