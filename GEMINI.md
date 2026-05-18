# PeopleMapBaranggay Project

PeopleMapBaranggay is a comprehensive management system designed for barangay (village) administration. It features a decoupled architecture with a modern React frontend and a Laravel backend.

## Architecture & Technologies

### Client (Frontend)
- **Framework:** React 19 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (utilizing OKLCH color space)
- **Routing:** React Router 7
- **UI Components:** custom components located in `src/components/ui`
- **Notifications:** `react-hot-toast` (via `src/util/notify.ts`)
- **Icons:** `react-icons/fa6`

### Server (Backend)
- **Framework:** Laravel 12
- **Language:** PHP 8.2+
- **Authentication:** Laravel Sanctum
- **Database:** (Configurable via `.env`, likely MySQL/PostgreSQL/SQLite)

## Project Structure

```text
PeopleMapBaranggay/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # UI and Layout components
│   │   ├── pages/          # Page components (Sitio, Residents, etc.)
│   │   ├── routes/         # Routing configuration
│   │   └── util/           # Utility functions (notifications, etc.)
│   └── ...
└── server/                 # Laravel backend application
    ├── app/                # Backend logic (Models, Controllers, etc.)
    ├── routes/             # API and Web routes
    └── ...
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PHP (v8.2+)
- Composer
- A local web server (XAMPP/Laragon/Sail)

### Installation

#### Backend (Server)
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Setup environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Run migrations:
   ```bash
   php artisan migrate
   ```

#### Frontend (Client)
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Development Commands

### Running the App
- **Backend:** `php artisan serve` (within `server/`)
- **Frontend:** `npm run dev` (within `client/`)

### Building for Production
- **Backend:** `npm run build` (within `server/` if using integrated assets)
- **Frontend:** `npm run build` (within `client/`)

## Development Conventions

### React Components
- Use functional components with TypeScript interfaces for props.
- Keep UI components reusable and isolated in `src/components/ui`.
- Use the `notify` utility for consistent toast notifications.

### Styling
- Adhere to the OKLCH-based Tailwind theme defined in `client/src/App.css`.
- Use semantic color names from the theme (e.g., `text-primary`, `bg-bg-dark`).

### State Management
- Prefer local state (`useState`) for UI-only logic.
- Use `isLoading` patterns for asynchronous actions (API calls, form submissions).

## Key Modules
- **Sitio:** Management of local sub-districts.
- **Residents:** Database of barangay residents.
- **Household:** Grouping of residents by household.
- **Beneficiaries:** Management of social service recipients.
- **Barangay Officials:** Records of local administration.
