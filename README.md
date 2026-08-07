# Sigap AI

Welcome to the Sigap AI repository! This project is a monorepo containing three main components:

- **Frontend**: Next.js / React (User Interface)
- **Backend**: Node.js / Express / TypeScript (Core API & Integrations)
- **AI**: Python / FastAPI (Sentiment Analysis & ML Models)

## Prerequisites

Before you start, make sure you have installed:
- [Node.js](https://nodejs.org/) (for frontend & backend)
- [Python 3](https://www.python.org/) (for AI)

---

## 🚀 Getting Started

To run the full stack locally, you need to set up the dependencies and environment variables for each folder.

### 1. Frontend Setup

The frontend is built with Next.js and interacts with our backend API.

```bash
cd frontend
npm install
```

**Environment Variables:** Create a `.env` file inside the `frontend/` folder. Here is the `.env.example` data you need:

```env
# The URL where your backend is running
NEXT_PUBLIC_API_URL="http://localhost:8080"

# Secret used for Authentication (Generate one using: openssl rand -base64 32)
AUTH_SECRET="your-auth-secret-here"
```

To run the frontend development server:
```bash
npm run dev
```

### 2. Backend Setup

The backend handles the business logic, database connections (Supabase), and communicates with the AI service.

```bash
cd backend
npm install
```

**Environment Variables:** Create a `.env` file inside the `backend/` folder. Here is the `.env.example` data you need:

```env
NODE_ENV=development
PORT=8080
FRONTEND_URL="http://localhost:3000"

# Supabase Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:5432/postgres"
SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# AI & Model API
GEMINI_API_KEY="your-gemini-api-key"
MODEL_API_URL="http://localhost:8000"

# Email Services (SMTP - e.g., Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

To run the backend development server:
```bash
npm run dev
```

### 3. AI Setup

The AI folder uses Python and FastAPI. It runs the sentiment analysis model. You must create a virtual environment so the packages don't conflict with your global Python installation.

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

# 4. Start the FastAPI server
python main.py
```
*The AI server will start on `http://localhost:8000` by default.*

---

## 🛠 Git Hooks (Required)

This project uses Husky to automatically run linting and formatting before you commit code. To initialize it on your machine, run this **once** in the Root directory of the project:

```bash
npm install
npx husky init
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
