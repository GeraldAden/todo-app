# TODO Application

A full-stack TODO application built with React (frontend) and FastAPI (backend).

## Prerequisites

- Docker and Docker Compose
- Python 3.12+ (for local development)
- Node.js and npm (for local development)

## Database Setup

1. Create the todo-data directory:
```bash
mkdir todo-data
```

2. Initialize the SQLite database using the provided script:
```bash
cd db
sqlite3 ../todo-data/todos.db < create_database.sql
```

## Running the Application

### Using Docker Compose (Recommended)

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Setup

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Application Features

- View all todos with their status and deadline dates
- Create new todos with descriptions and deadline dates
- Delete existing todos
- Change todo status (new, started, done)
- Filter todos by status
- Sort todos by deadline date