import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

var AuthContext = createContext(null);

export function AuthProvider(props) {
  var children = props.children;
  var userState = useState(null);
  var user = userState[0];
  var setUser = userState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  useEffect(function () {
    var token = localStorage.getItem('ph_token');
    var savedUser = localStorage.getItem('ph_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ph_token');
        localStorage.removeItem('ph_user');
      }
    }
    setLoading(false);
  }, []);

  var verifyAuth = useCallback(function () {
    var token = localStorage.getItem('ph_token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    authApi.getMe()
      .then(function (res) {
        if (res.data.success) {
          var userData = res.data.data;
          setUser(userData);
          localStorage.setItem('ph_user', JSON.stringify(userData));
        }
      })
      .catch(function () {
        localStorage.removeItem('ph_token');
        localStorage.removeItem('ph_user');
        setUser(null);
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  useEffect(function () {
    verifyAuth();
  }, [verifyAuth]);

  var login = function (email, password) {
    return authApi.login({ email: email, password: password }).then(function (res) {
      if (res.data.success) {
        var userData = res.data.data.user;
        var token = res.data.data.token;
        setUser(userData);
        localStorage.setItem('ph_token', token);
        localStorage.setItem('ph_user', JSON.stringify(userData));
      }
      return res.data;
    });
  };

  var register = function (name, email, password) {
    return authApi.register({ name: name, email: email, password: password }).then(function (res) {
      if (res.data.success) {
        var userData = res.data.data.user;
        var token = res.data.data.token;
        setUser(userData);
        localStorage.setItem('ph_token', token);
        localStorage.setItem('ph_user', JSON.stringify(userData));
      }
      return res.data;
    });
  };

  var logout = useCallback(function () {
    localStorage.removeItem('ph_token');
    localStorage.removeItem('ph_user');
    setUser(null);
  }, []);

  var updateUser = function (userData) {
    setUser(userData);
    localStorage.setItem('ph_user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loading: loading,
        isAuthenticated: !!user,
        login: login,
        register: register,
        logout: logout,
        updateUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  var context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;