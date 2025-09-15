using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using TodoDemo.Data;
using TodoDemo.Models;
using TaskStatusEnum = TodoDemo.Models.TaskStatus;

namespace TodoDemo.GraphQL;

public sealed record CreateTaskInput(string Title, string? Description);

public sealed record UpdateTaskStatusInput(int Id, TaskStatusEnum Status);

[ExtendObjectType(OperationTypeNames.Mutation)]
public sealed class TaskMutations
{
    public async Task<TaskItem> CreateTaskAsync(
        CreateTaskInput input,
        [Service] IDbContextFactory<TaskDbContext> contextFactory,
        [Service] ITopicEventSender eventSender,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
        {
            throw new GraphQLException(ErrorBuilder.New()
                .SetMessage("Task title must not be empty.")
                .SetCode("TASK_TITLE_EMPTY")
                .Build());
        }

        await using var dbContext = await contextFactory.CreateDbContextAsync(cancellationToken);

        var task = new TaskItem
        {
            Title = input.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(input.Description) ? null : input.Description.Trim(),
            Status = TaskStatusEnum.Pending,
            CreatedAt = DateTimeOffset.UtcNow
        };

        dbContext.Tasks.Add(task);
        await dbContext.SaveChangesAsync(cancellationToken);

        await PublishChangeAsync(eventSender, task, cancellationToken);

        return task;
    }

    public async Task<TaskItem> UpdateTaskStatusAsync(
        UpdateTaskStatusInput input,
        [Service] IDbContextFactory<TaskDbContext> contextFactory,
        [Service] ITopicEventSender eventSender,
        CancellationToken cancellationToken)
    {
        await using var dbContext = await contextFactory.CreateDbContextAsync(cancellationToken);

        var task = await dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == input.Id, cancellationToken);

        if (task is null)
        {
            throw new GraphQLException(ErrorBuilder.New()
                .SetMessage("Task with id {0} was not found.", input.Id)
                .SetCode("TASK_NOT_FOUND")
                .Build());
        }

        if (task.Status == input.Status)
        {
            return task;
        }

        task.Status = input.Status;
        task.UpdatedAt = DateTimeOffset.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        await PublishChangeAsync(eventSender, task, cancellationToken);

        return task;
    }

    private static ValueTask PublishChangeAsync(ITopicEventSender eventSender, TaskItem task, CancellationToken cancellationToken)
        => eventSender.SendAsync(nameof(TaskSubscriptions.OnTaskChanged), task, cancellationToken);
}
