import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/Auth';

function Login(props) {
  const [formState, setFormState] = useState({ email: '', password: ''});
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Signup function here? Or we may need another page for the signup

  return (
    <div className="login-page-container">
      <div className="input-container">
        {/* Kinda want to make the sign-up/login one page for ease purposes */}
        {/* Styles are currently pending CSS */}
        
        <div className="input-block">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleFormSubmit}>
            <div className="flex">
              <div className='input-label'>
                <label htmlFor="email">Email address:</label>
              </div>
              <input
                className='input-field'
                placeholder="youremailhere@email.com"
                name="email"
                type="email"
                id="login-email"
                onChange={handleChange}
              />
            </div>
            <div className="flex">
              <div className='input-label'>
                <label htmlFor="password">Password:</label>
              </div>
              <input
                className='input-field'
                placeholder="********"
                name="password"
                type="password"
                id="login-password"
                onChange={handleChange}
              />
            </div>
            {error ? (
              <div>
                <p className="error-txt">Credentials incorrect</p>
              </div>
            ) : null}
            <div className="flex">
              <button className="submit-btn" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>

      <div className='divider-div'>

        <h3>OR</h3>
        
        <Link to="/signup" className='context-link'><h2>Go to Signup!</h2></Link>
      </div>
    </div>
  );
}

export default Login;