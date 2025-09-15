import { createClient } from 'graphql-ws';
import type {
  FetchFunction,
  GraphQLResponse,
  RequestParameters,
  SubscribeFunction,
  Variables,
} from 'relay-runtime';
import { Environment, Network, Observable, RecordSource, Store } from 'relay-runtime';

const resolveHttpEndpoint = (): string => {
  const envValue = import.meta.env.VITE_GRAPHQL_HTTP;

  if (envValue) {
    if (typeof window !== 'undefined') {
      return new URL(envValue, window.location.href).toString();
    }

    return envValue;
  }

  return 'http://localhost:5220/graphql';
};

const httpEndpoint = resolveHttpEndpoint();

const resolveWsEndpoint = (): string => {
  const envValue = import.meta.env.VITE_GRAPHQL_WS;

  if (typeof window !== 'undefined') {
    const url = new URL(envValue ?? httpEndpoint, window.location.href);

    if (url.protocol === 'http:') {
      url.protocol = 'ws:';
    } else if (url.protocol === 'https:') {
      url.protocol = 'wss:';
    }

    return url.toString();
  }

  if (envValue) {
    return envValue;
  }

  return httpEndpoint.startsWith('https')
    ? `wss${httpEndpoint.substring(5)}`
    : `ws${httpEndpoint.substring(4)}`;
};

const wsEndpoint = resolveWsEndpoint();

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
