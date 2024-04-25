// LoginPage.js
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Loginpage.css'; // Import the Mainpage.css file

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      window.location.href = '/';
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: username,
        password: password,
      });
      localStorage.setItem('token', response.data.access);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging in: Please check your username and password.'); // Updated line
    }
  };

  return (
    <div class="login-page">
    <div className="login-container">
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
      <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
      <button onClick={handleLoginClick}>Login</button>
    </div>
    </div>
  );
}

export default LoginPage;
