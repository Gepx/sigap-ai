# Sigap AI

Welcome to the Sigap AI repository! This project is a monorepo containing three main components:

- **Frontend**: Next.js / React
- **Backend**: Node.js / Express / TypeScript
- **AI**: Python

## Prerequisites

Before you start, make sure you have installed:

- [Node.js](https://nodejs.org/) (for frontend & backend)
- [Python 3](https://www.python.org/) (for AI)

---

## 🚀 Getting Started

When you clone this repository, you need to set up the dependencies and environment variables for each folder.

### 1. Frontend Setup

```bash
cd frontend
npm install
```

**Environment Variables:** Create a `.env` file inside the `frontend/` folder with the following content:

````env
NEXT_PUBLIC_URL=http://localhost:8080


To run the frontend development server:

```bash
npm run dev
````

### 2. Backend Setup

```bash
cd backend
npm install
```

**Environment Variables:** Create a `.env` file inside the `backend/` folder with the following content:

```env
PORT=8080

NODE_ENV=
FRONTEND_URL=

# Supabase
DATABASE_HOST=
DATABASE_NAME=
DATABASE_PASSWORD=
DATABASE_USER=
DATABASE_PORT=
```

To run the backend development server:

```bash
npm run dev
```

### 3. AI Setup

The AI folder uses Python. You must create a virtual environment so the packages don't conflict with your computer.

```bash
cd ai

# 1. Create the virtual environment
python3 -m venv venv

# 2. Activate it (You MUST run this every time you open a new terminal for AI work!)
# On Mac/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# 3. Install the required packages
pip install -r requirements.txt
```

---

## 🛠 Git Hooks (Required)

This project uses Husky to automatically run linting and formatting before you commit code. To initialize it on your machine, run this **once** in the Root directory of the project:

```bash
npm install
npx husky init
```
