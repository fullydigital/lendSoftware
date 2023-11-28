import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = true;
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem('auth-token');
    if (token) {
      let tokenExpiration = jwtDecode(token).exp;
      let dateNow = new Date();

      if (tokenExpiration < dateNow.getTime() / 1000) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [auth]
  );

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate replave to="/" exact />;
};

export default PrivateRoute;