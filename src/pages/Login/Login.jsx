import React from 'react';
import LoginForm from '../../components/auth/LoginForm/LoginForm.jsx';

const Login = () => {
  const handleLogin = (formData) => {
    console.log('Datos de login:', formData);
    // Aquí irá la lógica de autenticación cuando conectemos con las APIs
    alert(`Login simulado con: ${formData.email}`);
  };

  return (
    <div className="login-page">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default Login;