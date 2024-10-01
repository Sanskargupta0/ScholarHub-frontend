import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from "react-toastify";
import { Authprovider } from "./store/auth.jsx";
import App from './App.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
    <App />
    <ToastContainer
    autoClose={2000}
     />
    </Authprovider>
  </StrictMode>,
)
