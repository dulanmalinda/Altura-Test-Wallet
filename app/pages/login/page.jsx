"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as CryptoJS from 'crypto-js';

export default function Login() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState('');
  const router = useRouter();

  const decryptMnemonic = (encryptedMnemonic, password) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
      const decryptedMnemonic = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedMnemonic;
    } catch (error) {
      console.error('Error decrypting mnemonic:', error);
      return null;
    }
  };

  const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
  };

  const onSubmit = (data) => {
    // Fetch the encrypted mnemonic from secure storage
    const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');

    // Attempt to decrypt the mnemonic with the provided password
    const password = data.password;
    const decryptedMnemonic = decryptMnemonic(encryptedMnemonic, password);

    if (decryptedMnemonic) {
      // Redirect to the main screen or perform other actions
      console.log('Successfully logged in. Redirecting...');
      const authToken = password;
       setAuthToken(authToken);
      router.push('/pages/dashboard');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  const onWalletCreateBTN = () => {
    router.push('/pages/create');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Wallet Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <label className="block mb-4">
          Password:
          <input
            type="password"
            {...register('password', { required: true })}
            className="border rounded w-full p-2"
            style={{ color: "black" }}
          />
        </label>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </button>

        <button
          onClick={onWalletCreateBTN}
          style={{marginLeft:"2%"}}
          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Wallet
        </button>
      </form>
    </div>
  );
}
