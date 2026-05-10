# PeopleMapBaranggay

PeopleMapBaranggay is a comprehensive management system designed for barangay (village) administration. It features a modern React frontend and a robust Laravel backend.

## 🚀 Project Overview

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, React Router 7.
- **Backend:** Laravel 12, PHP 8.2+, MySQL/PostgreSQL.
- **Key Features:** Sitio Management, Resident Database, Household Tracking, Beneficiary Monitoring (PWD, 4Ps, Solo Parent, Senior Citizen), and Barangay Official Records.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your desktop:

- **PHP:** v8.2 or higher
- **Composer:** Latest version
- **Node.js:** v18.0 or higher
- **NPM:** Latest version
- **Database:** MySQL, MariaDB, or PostgreSQL
- **Web Server:** XAMPP, Laragon, or Laravel Herd (recommended for Windows)

---

## 📥 Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PeopleMapBaranggay
```

### 2. Backend Setup (Laravel)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   _Edit the `.env` file and update your database credentials (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)._
4. Generate application key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations and seed the database:
   ```bash
   php artisan migrate --seed
   ```
6. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   _The API will be available at `http://127.0.0.1:8000`._

### 3. Frontend Setup (React)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   _The application will be available at `http://localhost:5173` (or the port shown in your terminal)._

---

## 📖 Development Commands

### Server (Laravel)

- `php artisan serve`: Run the API server.
- `php artisan migrate`: Run database migrations.
- `php artisan db:seed`: Seed the database with sample data.
- `php artisan tinker`: Interactive PHP shell.

### Client (React)

- `npm run dev`: Start the development server with Hot Module Replacement (HMR).
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint to check for code quality.

---

## 📁 Project Structure

```text
PeopleMapBaranggay/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components (Tailwind CSS)
│   │   ├── pages/          # Application views
│   │   ├── routes/         # React Router configuration
│   │   └── util/           # Axios config and utilities
├── server/                 # Laravel 12 backend
│   ├── app/                # Models, Controllers, Services
│   ├── database/           # Migrations and Seeders
│   └── routes/             # API endpoint definitions
└── README.md               # Project documentation
```

---

## 🤝 Troubleshooting

- **CORS Issues:** If the frontend cannot communicate with the backend, ensure `CORS_ALLOWED_ORIGINS` in `server/.env` includes your frontend URL (usually `http://localhost:5173`).
- **Database Connection:** Double-check your `DB_CONNECTION` and port in `.env`.
- **Node Version:** If `npm install` fails, ensure you are using a compatible Node.js version (`node -v`).

---

## 📝 License

This project is licensed under the MIT License.

php artisan serve --host=0.0.0.0 --port=8000
