# Team Task Manager

A full-stack task management application where admins assign tasks to team members and track progress in real time.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat-square)
![H2](https://img.shields.io/badge/Database-H2-lightgrey?style=flat-square)

---

## Features

- JWT-based authentication and authorization
- Role-based access control — Admin and Team Member
- Admin can create, assign, update, and delete tasks
- Team members can view and update status of assigned tasks
- In-memory H2 database with H2 Console for development

---

## Tech Stack

| | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Security, JWT |
| Frontend | React.js |
| Database | H2 (in-memory) |
| Build Tool | Maven |

---

## Project Structure

```
team-task-manager/
├── backend/
│   ├── src/main/java/
│   │   └── com/taskmanager/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── model/
│   │       ├── repository/
│   │       └── security/
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven

### 1. Clone the repo

```bash
git clone https://github.com/jshobhit13/team-task-manager.git
cd team-task-manager
```

### 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`  
H2 Console at `http://localhost:8080/h2-console`

> Default H2 credentials — JDBC URL: `jdbc:h2:mem:testdb`, Username: `sa`, Password: *(empty)*

### 3. Run the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login — returns JWT token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task *(Admin only)* |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task *(Admin only)* |

> All `/api/tasks` routes require `Authorization: Bearer <token>` header.

---

## Author

**Shobhit Jain** — [@jshobhit13](https://github.com/jshobhit13)  
B.Tech CSE, Galgotias University (2026)
