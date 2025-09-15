using HotChocolate.Subscriptions;
using HotChocolate.Types;
using TodoDemo.Models;

namespace TodoDemo.GraphQL;

[ExtendObjectType(OperationTypeNames.Subscription)]
public sealed class TaskSubscriptions
{
    [Subscribe]
    [Topic]
    public TaskItem OnTaskChanged([EventMessage] TaskItem task) => task;
}
