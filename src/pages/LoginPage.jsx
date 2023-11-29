import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants.js';


const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!,
    $password: String!
  ) {
    tokenAuth(
      email: $email,
      password: $password,
    ) {
      token
    }
  }
`


const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: email,
      password: password
    },
    onCompleted: (data) => {
      localStorage.setItem(AUTH_TOKEN, data.tokenAuth.token);
      navigate('/admin');
    }
  });

  return (
    <>
      <section className="bg-white mb-52">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">Zum Franchise einloggen</h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">Hier können Sie auf Ihre Franchise Daten zugreifen</p>
          <div className="space-y-8">
            <div>
              <label for="Email" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input onChange={(value) => setEmail(value.target.value)} type="email" id="Email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 " placeholder="Name" required />
            </div>
            <div>
              <label for="password" className="block mb-2 text-sm font-medium text-gray-900">Passwort</label>
              <input onChange={(value) => { setPassword(value.target.value) }} type="password" id="password" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500" placeholder="Passwort" required />
            </div>
            <button onClick={login}
              className="py-3 px-5 text-sm font-medium text-center text-white bg-red-700 sm:w-fit hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">Einloggen</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;