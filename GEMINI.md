# PeopleMapBaranggay Project

PeopleMapBaranggay is a comprehensive management system designed for barangay (village) administration. It features a modern, multi-platform architecture with a React web frontend, a Flutter mobile application, and a Laravel backend.

## Architecture & Technologies

### Client (Web Frontend)
- **Framework:** React 19 with Vite 8
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (utilizing OKLCH color space)
- **Routing:** React Router 7
- **UI Components:** custom components located in `src/components/ui`
- **Notifications:** `react-hot-toast` (via `src/util/notify.ts`)
- **Icons:** `react-icons/fa6`

### Mobile (Mobile Application)
- **Framework:** Flutter (SDK ^3.12.0)
- **State Management:** Riverpod 3
- **Networking:** Dio 5
- **Local Storage:** Flutter Secure Storage (for authentication tokens)
- **UI Utilities:** ScreenUtil (responsive design), Google Fonts

### Server (Backend API)
- **Framework:** Laravel 12
- **Language:** PHP 8.2+
- **Authentication:** Laravel Sanctum 4.0
- **Database:** (Configurable via `.env`, likely MySQL/PostgreSQL/SQLite)
- **Reporting:** 
  - PDF Generation: `barryvdh/laravel-dompdf`
  - Spreadsheet Export: `openspout/openspout`
- **Integrations:** n8n (for automated workflows and emergency broadcasts)

## Project Structure

```text
PeopleMapBaranggay/
├── client/                 # React web application
│   ├── src/
│   │   ├── components/     # UI and Layout components
│   │   ├── pages/          # Page components (Sitio, Residents, etc.)
│   │   ├── routes/         # Routing configuration
│   │   └── util/           # Utility functions (notifications, etc.)
│   └── ...
├── ite4_finalproj/         # Flutter mobile application
│   ├── lib/
│   │   ├── core/           # Core logic (router, network, theme)
│   │   └── main.dart       # App entry point
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
- Flutter SDK (^3.12.0)
- A local web server (XAMPP/Laragon/Sail)

### Installation

#### Backend (Server)
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `composer install`
3. Setup environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Run migrations: `php artisan migrate`

#### Web Frontend (Client)
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`

#### Mobile App (ite4_finalproj)
1. Navigate to the mobile directory: `cd ite4_finalproj`
2. Install dependencies: `flutter pub get`

## Development Commands

### Running the App
- **Backend:** `php artisan serve` (within `server/`)
- **Web Frontend:** `npm run dev` (within `client/`)
- **Mobile App:** `flutter run` (within `ite4_finalproj/`)

### Building for Production
- **Backend:** `npm run build` (within `server/` if using integrated assets)
- **Web Frontend:** `npm run build` (within `client/`)
- **Mobile App:** `flutter build apk` or `flutter build ios`

## Development Conventions

### React Components
- Use functional components with TypeScript interfaces for props.
- Keep UI components reusable and isolated in `src/components/ui`.
- Use the `notify` utility for consistent toast notifications.

### Flutter (Mobile)
- Follow the `core` architecture pattern for shared logic.
- Use Riverpod for state management and Dio for API interactions.
- Ensure responsive UI using `flutter_screenutil`.

### Styling (Web)
- Adhere to the OKLCH-based Tailwind theme defined in `client/src/App.css`.
- Use semantic color names from the theme (e.g., `text-primary`, `bg-bg-dark`).

## Key Modules
- **Sitio:** Management of local sub-districts.
- **Residents:** Database of barangay residents with document export capabilities.
- **Household:** Grouping of residents by household.
- **Beneficiaries:** Management of social service recipients (PWD, Solo Parent, 4Ps, Senior Citizen) with specialized export routes.
- **Barangay Officials:** Records of local administration.
- **Announcements:** System for posting and managing community updates.
- **Document Requests:** Digital workflow for residents to request certificates and permits.
- **Disaster Readiness:** Modules for managing incidents and emergency broadcasts (integrated with n8n).

## Integrations & Automation
- **n8n:** Used for local resident data access and triggering emergency broadcasts via API hooks.
