import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/Auth';

function Signup(props) {
  const [formState, setFormState] = useState({ email: '', password: '', userName: '' });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const mutationResponse = await addUser({
      variables: {
        email: formState.email,
        password: formState.password,
        userName: formState.userName,
      },
    });
    const token = mutationResponse.data.addUser.token;
    Auth.login(token);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };


  return (
    <div className="signup-page-container">
      <div className='input-container'>
        <div className="input-block">
          <h2>Sign Up</h2>
          <form className="signup-form" onSubmit={handleFormSubmit}>
            <div className="flex">
              <div className='input-label'>
                <label htmlFor="username">Username:</label>
              </div>
              <input
                className='input-field'
                placeholder="YourNameHere"
                name="userName"
                type="userName"
                id="signup-username"
                onChange={handleChange}
              />
            </div>
            <div className="flex">
              <div className='input-label'>
                <label htmlFor="email">Email address:</label>
              </div>
              <input
                className='input-field'
                placeholder="youremailhere@email.com"
                name="email"
                type="email"
                id="signup-email"
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
                id="signup-password"
                onChange={handleChange}
              />
            </div>
            <div className="flex">
                <button className="submit-btn" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className='divider-div'>

        <h3>Already have an account?</h3>

        <Link to="/login" className='context-link'><h2>Go to login!</h2></Link>
      </div>
    </div>
  );
};

export default Signup;