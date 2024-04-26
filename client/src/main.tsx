import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import ChatLayout from './layouts/ChatLayout/ChatLayout.tsx';
import RoomPage from './pages/ChatPage/ChatPage.tsx';
import ChatPlaceholder from './components/ChatPlaceholder/ChatPlaceholder.tsx';
import AuthLayout from './layouts/AuthLayout/AuthLayout.tsx';
import Register from './components/Auth/Register/Register.tsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.tsx';
import Login from './components/Auth/Login/Login.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: (<PrivateRoute><ChatLayout /></PrivateRoute>),
    children: [
      { path: '/:roomId', element: <RoomPage /> },
      { path: '/', element: <ChatPlaceholder /> },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: '/auth', element: <Navigate to="/auth/login" replace /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>,
)
