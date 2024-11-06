import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import SellerAdminHeader from './components/header';
import UserDetail from './userdetail';
import BondManagment from './bondmanagment';
const router = createBrowserRouter([
  {
    path: "/usermanagment",
    element: <SellerAdminHeader><App /></SellerAdminHeader>,
  },
  {
    path: "/userdetail/:useremail",
    element: <SellerAdminHeader><UserDetail /></SellerAdminHeader>,
  },
  {
    path: "/bondmanagement",
    element: <SellerAdminHeader><BondManagment /></SellerAdminHeader>,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
