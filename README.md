# Vinihida Beverages

A full-stack e-commerce application for premium alcoholic beverages built with React, Flask, and PostgreSQL.

## Features

- User authentication and authorization
- Product browsing and filtering
- Shopping cart functionality
- Secure checkout process
- Order management
- Age verification
- Responsive design

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- PostgreSQL

## Installation

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with:
```
VITE_API_URL=http://localhost:5000/api
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
  ```bash
  venv\Scripts\activate
  ```
- Unix/MacOS:
  ```bash
  source venv/bin/activate
  ```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory with:
```
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://username:password@localhost:5432/vinihida
JWT_SECRET_KEY=your-jwt-secret
```

## Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Setup

The application will automatically create the necessary tables and add sample data when you first run the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.