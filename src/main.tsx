import React from 'react'
import ReactDOM from 'react-dom/client'
import Banker from './pages/Banker.tsx'
import NotFound from "./pages/404.tsx"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.tsx'
import Meal from './pages/Meal.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />
  },
  {
    path: "/poker",
    element: <Banker />
  },
  {
    path: "/meal",
    element: <Meal />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
