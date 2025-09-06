import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If a token exists, render the child component (the protected page)
  // Otherwise, redirect the user to the login page
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;