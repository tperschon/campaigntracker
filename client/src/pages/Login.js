import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
// Link will be used in the event we make a signup page.
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

  return (
    <div className="container my-1">
      {/* Kinda want to make the sign-up/login one page for ease purposes */}
      {/* Styles are currently pending CSS */}

      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex">
          <label htmlFor="email">Email address:</label>
          <input
            placeholder="youremailhere@email.com"
            name="email"
            type="email"
            id="login-email"
            onChange={handleChange}
          />
        </div>
        <div className="flex">
          <label htmlFor="password">Password:</label>
          <input
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div> 
  );
}

export default Login;