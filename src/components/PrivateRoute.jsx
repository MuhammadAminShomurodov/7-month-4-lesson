import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken")); // Replace with your actual authentication logic

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
