# Real-Time Todo Demo

A full-stack task manager that combines an ASP.NET Core GraphQL API with a React + Adobe React Spectrum front-end. Tasks are
persisted with Entity Framework Core and synchronize live through GraphQL subscriptions. The stack is fully containerized with
Docker Compose for an easy end-to-end setup.

## Project structure

| Folder | Description |
| --- | --- |
| `backend/` | ASP.NET Core 8 GraphQL API built with Hot Chocolate and Entity Framework Core. |
| `frontend/` | React 19 application styled with Adobe React Spectrum and powered by Relay. |
| `docker-compose.yml` | Orchestrates the SQL Server, backend, and frontend services. |

## Backend

### Prerequisites

* .NET 8 SDK
* SQLite (for the default local profile) or a reachable SQL Server instance

### Running locally

```bash
# from the repository root
ASPNETCORE_URLS=http://localhost:5220 dotnet run --project backend
```

The API listens on `/graphql`. When started locally without extra configuration it uses a SQLite database stored in
`backend/tasks.db`. To target SQL Server instead, set the following environment variables:

```bash
export DatabaseProvider=sqlserver
export ConnectionStrings__DefaultConnection="Server=localhost;Database=TodoDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True;Encrypt=False"
ASPNETCORE_URLS=http://localhost:5220 dotnet run --project backend
```

The GraphQL surface currently exposes:

* `getAllTasks` – returns every task ordered by creation time
* `createTask(input: CreateTaskInput!)` – adds a task
* `updateTaskStatus(input: UpdateTaskStatusInput!)` – toggles a task status
* `onTaskChanged` – subscription that broadcasts newly created or updated tasks

## Frontend

### Prerequisites

* Node.js 20+

### Development workflow

```bash
cd frontend
npm install
npm run relay -- --watch  # optional watcher while editing GraphQL documents
VITE_GRAPHQL_HTTP=http://localhost:5220/graphql VITE_GRAPHQL_WS=ws://localhost:5220/graphql npm run dev
```

The site runs on `http://localhost:5173` by default. Build a production bundle with `npm run build` (the script runs the
Relay compiler and Vite build step).

## Docker Compose

Everything can be launched in containers with a single command:

```bash
docker compose up --build
```

This starts three services:

* `db` – SQL Server 2022 Express (data persisted in the `db-data` volume)
* `backend` – the ASP.NET Core GraphQL API on <http://localhost:5059/graphql>
* `frontend` – the React UI served by Nginx on <http://localhost:4173>

The Compose file passes the correct connection string and GraphQL endpoints between services. The frontend image performs a
production build using the provided GraphQL URLs before serving static assets through Nginx.

## GraphQL schema snapshot

The schema used by the Relay compiler is stored at `frontend/schema.graphql`. Regenerate it with the running backend via:

```bash
npx get-graphql-schema http://localhost:5220/graphql > frontend/schema.graphql
```

## Testing

* Backend: `dotnet build backend`
* Frontend: `cd frontend && npm run build`
* Containers: `docker compose up --build` (optional validation that images build correctly)

## Environment notes

* GraphQL subscriptions use WebSockets (`graphql-ws`). Ensure any reverse proxy forwards WebSocket traffic.
* The backend falls back to SQLite when `DatabaseProvider` is unset. SQL Server is used automatically in Docker Compose.
