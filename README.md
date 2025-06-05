# PAHINgA - Personal AI Health Insights and Journaling Application

PAHINgA is a web application that helps users track their mental health through journaling and AI-powered insights. The application analyzes journal entries to provide mood statistics and personalized insights.

## Features

- User Authentication (Register/Login)
- Journal Entry Creation and Management
- Mood Analysis and Statistics
- AI-Powered Insights
- User Profile Management
- Secure Token-based Authentication
- Responsive Design

## Requirements

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL

### Frontend
- React Vite
- Axios
- React Router DOM
- JWT Decode
- D3
- React-Hot-Toast
- Iconify
- React-Calendar

## Installation Guide

### Cloning the Repository
```bash
git clone https://github.com/yourusername/PAHINgA.git
cd PAHINgA
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Create superuser (optional):
```bash
python manage.py createsuperuser
```

6. Run Django server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install axios react-router-dom jwt-decode react-calendar react-hot-toast d3 @iconify/react
```

## Running the Application

### Backend
The Django server runs at http://localhost:8000
```bash
cd backend
python manage.py runserver
```

### Frontend
The React app runs at http://localhost:5173
```bash
cd frontend
npm run dev
```

## Project Structure

```
PAHINgA/
├── backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginRegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Journal.jsx
│   │   │   └── Profile.jsx
│   │   ├── api.js
│   │   ├── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

## User Guide

### Registration
1. Navigate to the registration page
2. Enter your username, email, and password
3. Password must meet the following requirements:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
4. Click "Register" to create your account

### Login
1. Navigate to the login page
2. Enter your username and password
3. Click "Login" to access your account

### Creating a Journal Entry
1. Navigate to the Journal page
2. Click "New Entry"
3. Enter your journal content
4. Submit to save your entry

### Viewing Insights
1. After creating a journal entry, the system will analyze your content
2. View mood statistics and insights on your dashboard
3. Access detailed analysis in the Insights section

### Profile Management
1. Access your profile through the navigation menu
2. Update your personal information
3. View your journal history and statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
