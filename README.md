# Frontend README

## Project Overview

This frontend is a React-based task management dashboard for creating projects, adding tasks, tracking task status, and managing authenticated user sessions. It connects to the Node.js/Express backend through REST APIs and provides the full user interface for login, signup, project management, and task workflows.

## Tech Stack

- React 19
- Vite
- Axios
- Bootstrap 5
- Formik
- Yup
- ESLint

## Local Setup

1. Open the frontend directory:

```bash
cd Frontend/Todo-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add the backend API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

5. Open the frontend in your browser:

```text
http://localhost:5173
```

## Deployment URLs

- Local frontend URL: `http://localhost:5173`
- Local backend API base URL: `http://localhost:5000/api`
- Production frontend URL: Not configured in this repository
- Production backend URL: Not configured in this repository

## Folder Structure

```text
Todo-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env
├── package.json
└── vite.config.js
```

### Important Frontend Folders

- `src/components`: UI components such as login, header, forms, project sidebar, board, and confirmation dialog
- `src/utils`: API clients, auth helpers, and task utility functions
- `src/App.jsx`: Main application container and data-loading flow

## API List

The frontend consumes the following backend APIs:

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Log in an existing user
- `POST /auth/logout` - Log out the current user
- `GET /auth/profile` - Fetch the authenticated user profile

### Projects

- `POST /projects/project` - Create a new project
- `GET /projects/project` - Get all projects for the logged-in user
- `DELETE /projects/project/:projectId` - Delete a project and its related tasks

### Tasks

- `POST /tasks/task` - Create a new task
- `GET /tasks/task` - Get all tasks for the logged-in user
- `PATCH /tasks/task/:taskId` - Update task status or details
- `DELETE /tasks/task/:taskId` - Delete a task

## Notes

- All protected API requests use a Bearer token stored after login or signup.
- API base URLs are read from `VITE_API_BASE_URL`, so frontend files should not contain hardcoded backend URLs.
