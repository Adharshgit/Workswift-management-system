---
description: How to start the WSMS application (both backend and frontend)
---

# Starting the Work Shift Management System

## Quick Start (Recommended)
Double-click `start.bat` in the project root folder, or run:
```powershell
.\start.bat
```

## Manual Start

### 1. Start the Backend Server
// turbo
```powershell
cd c:\Users\Adharsh\Desktop\wsms\backend
.\venv\Scripts\python.exe manage.py runserver
```
This starts Django on http://localhost:8000

### 2. Start the Frontend Server (in a new terminal)
// turbo
```powershell
cd c:\Users\Adharsh\Desktop\wsms\frontend
npm run dev
```
This starts Vite on http://localhost:5173

## Login Credentials
- **Username:** Adharsh
- **Password:** password123

## Troubleshooting
If you get "Invalid username or password":
1. Make sure the backend server is running (check for Django output in terminal)
2. Check that both servers are accessible at their respective ports
