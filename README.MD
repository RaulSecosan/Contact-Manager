# Contact Manager

Users can view and search contacts without authentication. Registered users can add, edit and delete contacts, including contact pictures.

## Technologies

- Java 25 and Spring Boot
- Spring Security
- React, Vite and Bootstrap
- PostgreSQL 18
- Apache Kafka
- Docker and Docker Compose
- Nginx

## Features

- Public contact list
- Search contacts by name
- Add, edit and delete contacts after login
- Upload contact pictures (JPG and PNG)
- Export contacts to CSV
- User registration and login
- Session-based authentication
- Kafka event published on user registration
- Separate microservice consuming Kafka events
- HTTP communication between backend and microservice

## Project structure

```text
contactManager/
├── backend/          # Main Spring Boot application
├── frontend/         # React application
├── event-service/    # Kafka consumer microservice
├── docs/             # Database schema and diagrams
├── compose.yaml      # Docker Compose configuration
├── .env.example      # Environment variable example
└── README.md
```

## Requirements

To run the application using Docker:

- Docker Desktop or Docker Engine
- Docker Compose

Java and Node.js do not need to be installed locally when using Docker.

## Installation and running

### 1. Clone the repository

```bash
git clone https://github.com/RaulSecosan/Contact-Manager.git
cd contactManager
```

### 2. Configure environment variables

Create a `.env` file in the project root, using `.env.example` as a template.

Example:

```env
DB_NAME=contactmanager
DB_USER=contactuser
DB_PASSWORD=replace_with_a_password
```

Use the same database credentials for PostgreSQL and the backend.

Obs, the `.env` file must not be committed to Git.

### 3. Start the application

```bash
docker compose up --build -d
```

Docker Compose starts the following services:

| Service       | Description                       |
| ------------- | --------------------------------- |
| frontend      | React application served by Nginx |
| backend       | Spring Boot REST API              |
| database      | PostgreSQL                        |
| kafka         | Kafka message broker              |
| event-service | Kafka consumer and HTTP API       |

### 4. Open the application

Visit:

http://localhost:3000

The contact list and search functionality are public.

To add, edit or delete contacts, create an account using Register and then log in.

### 5. Stop the application

```bash
docker compose down
```

This stops the containers without removing persistent volumes.

To start the application again:

```bash
docker compose up -d
```

## Database

The application uses PostgreSQL.

Two tables are used:

- `users` — stores registered user accounts and BCrypt password hashes
- `contacts` — stores contact names, addresses and picture URLs

The database structure is available in:

- [SQL schema](docs/schema.sql)
- [Database ERD](docs/database-erd.png)

Hibernate manages the database tables when the backend starts.

The SQL schema is included as documentation and is not automatically imported by Docker Compose.

## Authentication and security

The application uses Spring Security with HTTP sessions.

- Visitors can view and search contacts.
- Registration and login are public.
- Adding, editing and deleting contacts require authentication.
- Passwords are stored using BCrypt.
- CSRF protection is enabled for requests that change data.

## Contact pictures

JPG and PNG pictures can be uploaded when creating or editing contacts.

Images are stored in a persistent Docker volume. PostgreSQL stores their relative URLs.

## CSV export

The application supports exporting contact information to CSV.

The export contains contact data in text format. Image files are stored separately and are not embedded in the CSV.

## Kafka integration

When a user registers:

1. The backend saves the new user in PostgreSQL.
2. The backend publishes a message to the `user-registered` Kafka topic.
3. The `event-service` microservice consumes the message.

The microservice provides an HTTP endpoint:

```text
GET /api/stats
```

The main backend communicates with this microservice through HTTP.

An authenticated user can access the integration endpoint through the frontend proxy:

```text
GET /api/integration/registration-stats
```

The returned counter represents events processed since the microservice started. It is not a permanent database statistic.

## Useful Docker commands

Check running containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs backend
```

View Kafka consumer logs:

```bash
docker compose logs event-service
```

Rebuild and restart:

```bash
docker compose up --build -d
```

## Notes

All application components can be started using Docker Compose.
