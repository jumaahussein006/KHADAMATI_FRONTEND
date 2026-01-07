# Khadamati - Home Services Platform (React)

Khadamati is a comprehensive web platform designed to connect customers with professional service providers. It features a modern, responsive user interface with role-based access control for Admins, Service Providers, and Customers.

## 🚀 Key Features

*   **Role-Based Authentication**: Secure login and registration for Customers, Providers, and Admins.
*   **Bilingual Support**: Full Arabic and English support with RTL layout for Arabic.
*   **Theme System**: built-in Dark/Light mode toggle.
*   **Service Management**: Providers can list, edit, and manage their services.
*   **Request System**: Customers can book services, and providers can manage incoming requests.
*   **Admin Dashboard**: Comprehensive analytics, user management, and category management.
*   **Interactive Maps**: Integration with Leaflet for location-based services.
*   **Mock Backend**: Fully functional implementation using local storage and mock data for demonstration.

## 🛠 Technology Stack

*   **Frontend Library**: React 18
*   **Styling**: Tailwind CSS, Framer Motion (for animations), Lucide React & React Icons
*   **Routing**: React Router DOM v6
*   **State Management**: React Context API
*   **Internationalization**: i18next & react-i18next
*   **Charts**: Recharts
*   **Maps**: React Leaflet
*   **Build Tool**: Create React App (React Scripts)

## 📂 Project Structure

```text
src/
├── assets/          # Static images and icons
├── components/      # Reusable UI components
├── context/         # React Contexts (Auth, Theme, etc.)
├── data/            # Static configuration data
├── i18n/            # Internationalization configuration & locales
├── layouts/         # Page layout wrappers (DashboardLayout, etc.)
├── pages/           # Application views
│   ├── admin/       # Admin specific pages
│   ├── customer/    # Customer dashboard pages
│   ├── provider/    # Provider dashboard pages
│   └── ...          # Public pages (Home, Login, Services, etc.)
├── services/        # API service modules
└── utils/           # Helper functions and Mock Data
```

## 📄 Pages Overview

### Public Pages
*   **Home** (`/`): Landing page with hero section, top categories, and featured services.
*   **Services** (`/services`): Browse and search all available services with filters.
*   **Service Details** (`/services/:id`): Detailed view of a specific service including pricing and description.
*   **Provider Details** (`/provider/:id`): Public profile of a service provider showing their services and reviews.
*   **Login** (`/login`) & **Register** (`/register`): User authentication pages.
*   **About** (`/about`) & **Contact** (`/contact`): Platform information and contact forms.

### Admin Portal (`/admin/*`)
*   **Dashboard**: Overview of platform statistics (Users, Revenue, Growth charts).
*   **Users**: Manage all registered users (Customers, Providers, Admins).
*   **Requests**: Monitor all service requests across the platform.
*   **Services**: Manage and moderate platform-wide services.
*   **Categories**: Add, edit, and manage service categories.
*   **Reports**: View system reports and analytics.
*   **Payments**: Monitor payment transaction part histories.
*   **Notifications**: System-wide notifications.
*   **Profile**: Admin profile settings.

### Provider Portal (`/provider/*`)
*   **Dashboard**: Provider-specific stats (Earnings, Active Requests, Rating).
*   **My Services**: Manage listed services (Add New, Edit, Delete).
*   **Add Service**: Form to create a new service offering.
*   **Service Requests**: Manage incoming job requests from customers (Accept/Reject).
*   **Certificates**: Manage professional certifications.
*   **Reviews**: View and respond to customer reviews.
*   **Notifications**: Job and system alerts.
*   **Profile**: Manage provider business profile.

### Customer Portal (`/customer/*`)
*   **Dashboard**: Overview of current bookings and recent activities.
*   **My Requests**: View and manage service bookings (History and Active).
*   **Notifications**: Status updates on requests.
*   **Profile**: Manage customer personal information.

## 💻 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm start
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```

## ℹ️ Additional Info

*   **Mock Data**: The application uses `src/utils/mockData.js` to initialize the local storage database. Resetting local storage will restore this default data.
*   **Localization**: Translation files are located in `src/i18n/locales/` (`ar.json` and `en.json`).
