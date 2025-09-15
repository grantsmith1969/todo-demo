import { createClient } from 'graphql-ws';
import type {
  FetchFunction,
  GraphQLResponse,
  RequestParameters,
  SubscribeFunction,
  Variables,
} from 'relay-runtime';
import { Environment, Network, Observable, RecordSource, Store } from 'relay-runtime';

const httpEndpoint = import.meta.env.VITE_GRAPHQL_HTTP ?? 'http://localhost:5220/graphql';
const fallbackWs = httpEndpoint.startsWith('https')
  ? `wss${httpEndpoint.substring(5)}`
  : `ws${httpEndpoint.substring(4)}`;
const wsEndpoint = import.meta.env.VITE_GRAPHQL_WS ?? fallbackWs;

const fetchQuery: FetchFunction = async (operation: RequestParameters, variables: Variables) => {
  const response = await fetch(httpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GraphQL fetch failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as GraphQLResponse;
};

let wsClient: ReturnType<typeof createClient> | null = null;

const subscribe: SubscribeFunction = (operation, variables) =>
  Observable.create<GraphQLResponse>((sink) => {
    if (!operation.text) {
      sink.error?.(new Error('Cannot subscribe without a GraphQL document.'));
      return undefined;
    }

    if (!wsClient) {
      wsClient = createClient({
        url: wsEndpoint,
        retryAttempts: 5,
      });
    }

    return wsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      {
        next: (result) => sink.next(result as GraphQLResponse),
        complete: () => sink.complete?.(),
        error: (err: unknown) => sink.error?.(err as Error),
      },
    );
  });

const environment = new Environment({
  network: Network.create(fetchQuery, subscribe),
  store: new Store(new RecordSource()),
});

export default environment;
