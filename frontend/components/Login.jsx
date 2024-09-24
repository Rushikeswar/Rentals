import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignupLogin.css';
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [Error, setError] = useState(false);
  const navigate = useNavigate();

  /////handling the submission of the form

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.log(errorResponse.errormessage);
        setError(true);
        setMessage(errorResponse.errormessage || "Error occurred!");
      } else {
        setUsername('');
        setPassword('');
        setError(false);
        setMessage('Sign In successful!');
        const sessionvalue =  sessionStorage.getItem('lastpage');
        if(sessionvalue === "NotFound" || sessionvalue === "signup") {
          sessionStorage.setItem('lastpage','login');
          navigate('/');
          return;
        } else {
          sessionStorage.setItem('lastpage','login');
          navigate(-1);
          return;
        }
      }
    } catch (error) {
      setError(true);
      setMessage('An unexpected error occurred.');
      console.log(error);
    }
  };

  return (
    <div id="signin-login-page">
      {/* <div><img id="leftimage" src={leftimage}></img></div> */}
    <div>
        <div className="auth-toggle">
        <button
        onClick={() => navigate('/Signup')}>
        Sign up
        </button>
        <button
        className="activebutton"
        onClick={() => navigate('/login')}>
        Sign in
        </button>
      </div>
    <div className="signup-login-container login-animate">
    <div>
      <h2 className="signup-login-title">Sign In</h2>

      <form id="signupForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          autoComplete='on'
        />

        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password"
          name="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign In</button>
        <div id="message" className={`form-message ${Error ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      </form>
    </div>
    </div>
    </div>
  </div>
  );
};

export default LoginForm;
