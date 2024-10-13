import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignIn from './SignIn.jsx';
import LogIn from './LogIn.jsx';
import Home from './Home.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Dashboard from './Dashboard.jsx';
import MyAgents from './MyAgents.jsx';
import AgentDetails from './AgentDetails.jsx';

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute element={<Dashboard />} />
        ),
        children:[
          {
            path: "",
        element: (
          <ProtectedRoute element={<MyAgents/>} /> 
        )
          },
          {
            path: "/dashboard/buy-agent", 
        element: (
          <ProtectedRoute element={<Home/>} /> 
        )
          }
        ]
      },{
        path:"/agent/:agentId",
        element:(
          <ProtectedRoute element={<AgentDetails/>} /> 
        )
      }
    ]
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/login",
    element: <LogIn/>
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
