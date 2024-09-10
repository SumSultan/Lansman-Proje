import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode; // 'children' propunun tipini belirtiyoruz
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = sessionStorage.getItem("admin_token");

  if (!token) {
    // Token yoksa login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  // Token varsa, istenen sayfayı göster
  return <>{children}</>;
};

export default ProtectedRoute;
