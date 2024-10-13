# Agent Master Frontend

This is the frontend for the **Agent Master** application, built with Vite and React. It uses Tailwind CSS for styling, React Router for routing, and environment variables configured through a `.env` file.

## Folder Structure

```
/src
  ├── assets/          # Image and static assets
  ├── AgentCard.jsx    # Component for displaying agent cards
  ├── AgentDetails.jsx # Component for displaying agent details
  ├── App.css          # Global CSS for the app
  ├── App.jsx          # Main component rendering routes and navigation
  ├── BuyAgent.jsx     # Component for agent purchasing logic
  ├── Dashboard.jsx    # Main dashboard for user interaction
  ├── Home.jsx         # Landing/homepage
  ├── Login.jsx        # Login component
  ├── MyAgents.jsx     # Component to display a list of user's agents
  ├── Navbar.jsx       # Navigation bar component
  ├── ProtectedRoute.jsx # Wrapper component for protected routes
  ├── SignIn.jsx       # Sign-in form
  ├── main.jsx         # Entry point to the React app
  ├── index.css        # Main CSS file for the project
  └── output.css       # Output CSS for Tailwind styles
```

## Technologies Used

- **Vite**: Development environment and build tool
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: For API calls
- **.env**: To manage environment variables

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rahulaauji-30/agent-master.git
   cd agent-master-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   or, if you're using Yarn:

   ```bash
   yarn install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory with the following variables:

   ```env
   VITE_API_URL=https://your-api-url.com
   VITE_APP_NAME=AgentMaster
   ```

   - `VITE_API_URL`: The URL of the backend API.
   - `VITE_APP_NAME`: Name of the application.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   or with Yarn:

   ```bash
   yarn dev
   ```

   The app should now be running on `http://localhost:5173` (Vite's default port).

## Available Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Bundles the app for production into the `dist` folder.
- **`npm run preview`**: Previews the production build locally.

## Environment Variables

All environment variables in Vite must be prefixed with `VITE_`. Example `.env` file:

```env
VITE_API_URL=https://api.agentmaster.com
VITE_APP_NAME=AgentMaster
```

## Build for Production

To create an optimized production build, run:

```bash
npm run build
```

The build artifacts will be located in the `dist` folder. You can then serve this folder using any static site hosting.

## Linting

To run ESLint and check code for any linting issues, use:

```bash
npm run lint
```