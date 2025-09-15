# React client

This folder contains the Relay-powered React UI for the Todo demo. It uses Adobe React Spectrum for the component library and
pulls data from the GraphQL API exposed by the backend.

## Available scripts

```bash
npm install          # install dependencies
npm run relay -- --watch  # optional watcher for GraphQL documents
npm run dev          # start the Vite dev server
npm run build        # create a production build in dist/
```

The UI expects the following build-time variables when connecting to a remote API:

* `VITE_GRAPHQL_HTTP` – the GraphQL HTTP endpoint (defaults to `http://localhost:5220/graphql`)
* `VITE_GRAPHQL_WS` – the GraphQL WebSocket endpoint (defaults to the HTTP endpoint with the `ws` scheme)
