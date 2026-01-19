# WSMS Project Sharing Guide

This guide explains how to set up the **Work Swift Management System** on a new computer.

## Requirements

### Backend
- **Python 3.10+**
- **Django** (installed via requirements.txt)

### Frontend
- **Node.js 18+**
- **npm** (comes with Node.js)

---

## Setup Instructions

### 1. Backend Setup
1. Open a terminal in the `backend/` folder.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### 2. Frontend Setup
1. Open a new terminal in the `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Technical Details
- **Backend:** Django 6.0.1, REST Framework, SimpleJWT (Auth), CORS Headers.
- **Frontend:** React, Vite, Tailwind CSS, Axios, Lucide Icons.
- **Database:** SQLite (local file `db.sqlite3`).
