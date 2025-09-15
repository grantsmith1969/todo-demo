import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Content,
  Divider,
  Flex,
  Form,
  Heading,
  IllustratedMessage,
  Item,
  ListView,
  StatusLight,
  Switch,
  Text,
  TextArea,
  TextField,
  View,
} from '@adobe/react-spectrum';
import { graphql, requestSubscription } from 'react-relay';
import { useLazyLoadQuery, useMutation, useRelayEnvironment } from 'react-relay/hooks';
import type { RecordProxy, RecordSourceSelectorProxy } from 'relay-runtime';

import type { AppTasksQuery } from './__generated__/AppTasksQuery.graphql';
import type { AppCreateTaskMutation } from './__generated__/AppCreateTaskMutation.graphql';
import type { AppUpdateTaskStatusMutation } from './__generated__/AppUpdateTaskStatusMutation.graphql';
import type { AppTaskSubscription } from './__generated__/AppTaskSubscription.graphql';

const tasksQuery = graphql`
  query AppTasksQuery {
    getAllTasks {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const createTaskMutation = graphql`
  mutation AppCreateTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const updateTaskStatusMutation = graphql`
  mutation AppUpdateTaskStatusMutation($input: UpdateTaskStatusInput!) {
    updateTaskStatus(input: $input) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const taskSubscription = graphql`
  subscription AppTaskSubscription {
    onTaskChanged {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

const statusVariant: Record<string, 'positive' | 'notice'> = {
  COMPLETED: 'positive',
  PENDING: 'notice',
};

function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    return formatter.format(new Date(value));
  } catch {
    return value;
  }
}

function formatStatusLabel(status: string) {
  const normalized = status.toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

const errorColor = 'var(--spectrum-global-color-red-600)';
const panelShadow = { boxShadow: 'var(--spectrum-alias-shadow-small, 0 1px 4px rgba(0, 0, 0, 0.1))' } as const;

export default function App() {
  const environment = useRelayEnvironment();
  const data = useLazyLoadQuery<AppTasksQuery>(
    tasksQuery,
    {},
    { fetchPolicy: 'store-and-network' },
  );

  const [commitCreateTask, isCreating] = useMutation<AppCreateTaskMutation>(createTaskMutation);
  const [commitUpdateTask] = useMutation<AppUpdateTaskStatusMutation>(updateTaskStatusMutation);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const subscription = requestSubscription<AppTaskSubscription>(environment, {
      subscription: taskSubscription,
      variables: {},
      updater: (store: RecordSourceSelectorProxy) => {
        const changedTask = store.getRootField('onTaskChanged');
        if (!changedTask) {
          return;
        }

        const root = store.getRoot();
        const existingTasks = (root.getLinkedRecords('getAllTasks') ?? []) as (RecordProxy | null)[];
        const updatedTasks = existingTasks.filter(
          (record: RecordProxy | null) => record?.getDataID() !== changedTask.getDataID(),
        );

        root.setLinkedRecords([changedTask, ...updatedTasks], 'getAllTasks');
      },
    });

    return () => subscription.dispose();
  }, [environment]);

  const sortedTasks = useMemo(() => {
    const tasks = data.getAllTasks ?? [];

    return [...tasks].sort((a, b) => {
      const aTime = new Date(a.createdAt ?? '').getTime();
      const bTime = new Date(b.createdAt ?? '').getTime();
      return bTime - aTime;
    });
  }, [data.getAllTasks]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setFormError('Please add a title before saving.');
      return;
    }

    setFormError(null);

    commitCreateTask({
      variables: {
        input: {
          title: trimmedTitle,
          description: trimmedDescription.length > 0 ? trimmedDescription : null,
        },
      },
      updater: (store: RecordSourceSelectorProxy) => {
        const payload = store.getRootField('createTask');
        if (!payload) {
          return;
        }

        const root = store.getRoot();
        const existing = (root.getLinkedRecords('getAllTasks') ?? []) as (RecordProxy | null)[];
        root.setLinkedRecords([payload, ...existing], 'getAllTasks');
      },
      onCompleted: () => {
        setTitle('');
        setDescription('');
      },
      onError: (error: Error) => {
        setFormError(error.message);
      },
    });
  };

  const handleStatusToggle = (taskId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    setPendingTaskIds((previous) => {
      const next = new Set(previous);
      next.add(taskId);
      return next;
    });

    commitUpdateTask({
      variables: {
        input: {
          id: taskId,
          status: nextStatus,
        },
      },
      updater: (store: RecordSourceSelectorProxy) => {
        const payload = store.getRootField('updateTaskStatus');
        if (!payload) {
          return;
        }

        const root = store.getRoot();
        const existing = (root.getLinkedRecords('getAllTasks') ?? []) as (RecordProxy | null)[];
        const updated = existing.map((record: RecordProxy | null) =>
          record?.getDataID() === payload.getDataID() ? payload : record,
        );
        root.setLinkedRecords(updated, 'getAllTasks');
      },
      onCompleted: () => {
        setPendingTaskIds((previous) => {
          const next = new Set(previous);
          next.delete(taskId);
          return next;
        });
      },
      onError: (error: Error) => {
        console.error(error);
        setPendingTaskIds((previous) => {
          const next = new Set(previous);
          next.delete(taskId);
          return next;
        });
      },
    });
  };

  return (
    <View padding="size-200" backgroundColor="gray-100" minHeight="100vh">
      <Flex direction="column" gap="size-400" maxWidth="900px" marginX="auto">
        <View>
          <Heading level={1}>Real-time Tasks</Heading>
          <Content>
            <Text>
              Create tasks, keep track of their details, and update their status. Changes are
              broadcast instantly to every open client using GraphQL subscriptions.
            </Text>
          </Content>
        </View>

        <View backgroundColor="static-white" borderRadius="regular" padding="size-300" UNSAFE_style={panelShadow}>
          <Form onSubmit={handleSubmit} aria-label="Add a new task">
            <TextField
              label="Title"
              value={title}
              onChange={setTitle}
              isRequired
              placeholder="Add a short title"
            />
            <TextArea
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Optional details or notes"
            />
            <Button
              type="submit"
              variant="cta"
              isDisabled={isCreating}
              marginTop="size-200"
            >
              {isCreating ? 'Saving…' : 'Add task'}
            </Button>
          </Form>
          {formError ? (
            <Text UNSAFE_style={{ color: errorColor, marginTop: 'var(--spectrum-global-dimension-size-200)' }}>
              {formError}
            </Text>
          ) : null}
        </View>

        <Divider size="M" />

        <View backgroundColor="static-white" borderRadius="regular" padding="size-300" UNSAFE_style={panelShadow}>
          {sortedTasks.length === 0 ? (
            <IllustratedMessage>
              <Heading>No tasks yet</Heading>
              <Content>Add your first task to get started.</Content>
            </IllustratedMessage>
          ) : (
            <ListView aria-label="Task list" selectionMode="none">
              {sortedTasks.map((task) => {
                const isCompleted = task.status === 'COMPLETED';

                return (
                  <Item key={task.id} textValue={task.title}>
                    <Flex direction="column" gap="size-150">
                      <Flex alignItems="center" justifyContent="space-between">
                        <Heading level={4} marginBottom="0">
                          {task.title}
                        </Heading>
                        <Flex alignItems="center" gap="size-200">
                          <StatusLight variant={statusVariant[task.status] ?? 'notice'}>
                            {formatStatusLabel(task.status)}
                          </StatusLight>
                          <Switch
                            aria-label={`Toggle status for ${task.title}`}
                            isSelected={isCompleted}
                            onChange={() => handleStatusToggle(task.id, task.status)}
                            isDisabled={pendingTaskIds.has(task.id)}
                          >
                            {formatStatusLabel(task.status)}
                          </Switch>
                        </Flex>
                      </Flex>
                      {task.description ? <Text>{task.description}</Text> : null}
                      <Flex gap="size-150">
                        <Text UNSAFE_style={{ color: 'var(--spectrum-global-color-gray-600)' }}>
                          Created: {formatTimestamp(task.createdAt)}
                        </Text>
                        <Text UNSAFE_style={{ color: 'var(--spectrum-global-color-gray-600)' }}>
                          Updated: {formatTimestamp(task.updatedAt)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Item>
                );
              })}
            </ListView>
          )}
        </View>
      </Flex>
    </View>
  );
}
