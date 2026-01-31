import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './app/context/AuthContext';
import AppRoutes from './app/routes/AppRoutes';
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);