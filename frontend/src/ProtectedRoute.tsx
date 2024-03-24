import React from "react";
import { Route, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  path: string;
  element: React.ReactNode;
  isLoggedIn: boolean;
  redirectPath: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  path,
  element,
  isLoggedIn,
  redirectPath,
}) => {
  return isLoggedIn ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to={redirectPath} replace />
  );
};

export default ProtectedRoute;
