# Expense Tracker Frontend

A modern React frontend for the expense tracking application built with:

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **Axios** - HTTP client for API calls

## Features

- **Authentication** - Login and registration with JWT
- **Dashboard** - Overview of bills and expenses
- **Bill Management** - Create, view, and manage shared expense bills
- **Expense Tracking** - Add and track individual expenses within bills
- **Role-based Access** - Different permissions for admin and data-entry users
- **Responsive Design** - Works on desktop and mobile devices

## Environment Variables

Create a `.env` file in the client directory:

```
REACT_APP_API_URL=http://localhost:5000
```

## Available Scripts

- `npm start` - Runs the development server
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App

## API Integration

The frontend communicates with the Express backend via REST API calls:

- Authentication endpoints (`/auth/login`, `/auth/register`)
- Bills endpoints (`/bills/*`)
- Expenses endpoints (`/expenses/*`)

All API calls include automatic token handling and error management.