import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/homepage/Homepage.jsx';
import Dashboardpage from './routes/dashboardpage/Dashboardpage.jsx';
import Chatpage from './routes/chatpage/Chatpage.jsx';
import RootLayout from './layouts/rootLayout/RootLayout.jsx';
import DashboardLayout from './layouts/dasbordLayout/DashboardLayout.jsx';
import SignInPage from './routes/signInPage/SignInPage.jsx';
import SignUpPage from './routes/signUpPage/SignUpPage.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path: "/", 
        element: <Homepage/>
      },
      {
        path: "/sign-in/*", 
        element: <SignInPage/>
      },
      {
        path: "/sign-up/*", 
        element: <SignUpPage/>
      },
      {
        element: <DashboardLayout/>,
        children: [
          {
            path: "/dashboard",
            element: <Dashboardpage/>
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chatpage/>
          }
        ]
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
