"use client"

// Wallet.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as bip39 from 'bip39';
import * as CryptoJS from 'crypto-js';

import styles from './wallet.module.css';

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [mnemonic, setMnemonic] = useState('');
  const { handleSubmit, register, watch } = useForm();
  const password = watch('password');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const generateWallet = async () => {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);

    // Generate 12-word mnemonic
    const generatedMnemonic = bip39.generateMnemonic();
    setMnemonic(generatedMnemonic);
  };

  const encryptMnemonic = (mnemonic, password) => {
    const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonic, password).toString();
    return encryptedMnemonic;
  };

  const storeEncryptedMnemonic = (encryptedMnemonic) => {
    try {
      localStorage.setItem('encryptedMnemonic', encryptedMnemonic);
      console.log('Encrypted Mnemonic stored securely.');
    } catch (error) {
      console.error('Error storing encrypted mnemonic:', error);
    }
  };

  const onSubmit = (data) => {
    const encryptedMnemonic = encryptMnemonic(mnemonic, password);

    storeEncryptedMnemonic(encryptedMnemonic);
    console.log('Encrypted Mnemonic:', encryptedMnemonic);
    setIsOpen(true);
  };

  const onUserCreateWallet = () => {
    setIsOpen(false);
    router.push('/pages/login');
  };

  return (
    <div>
      
      <div className={`container mx-auto p-8 ${isOpen ? styles.blur : ''}`}>
        <h1 className="text-4xl font-bold mb-8">Ethereum Wallet Generator</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={generateWallet}
        >
          Generate New Wallet
        </button>

      {wallet && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your New Wallet:</h2>
          <p>
            <span className="font-bold">Address:</span> {wallet.address}
          </p>
          <p>
            <span className="font-bold">Private Key:</span> {wallet.privateKey}
          </p>
          <p>
            <span className="font-bold">Mnemonic:</span> {mnemonic}
          </p>
        </div>
      )}

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

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    

      </div>

      <div className={isOpen ? styles.modalOverlay : ''}>

      </div>

      <dialog style={{zIndex:1000,marginTop: "-20%",position:"fixed"}} open={isOpen} className="rounded-lg shadow-md p-8">
            <h2 className="text-lg font-bold mb-6" style={{ fontSize: '1.6em' }}>Wallet Created Successfully</h2>
            <div className="flex justify-center">
              <button style={{ fontSize: '1.4em' }} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700" onClick={onUserCreateWallet}>Close</button>
            </div>
      </dialog>

    </div>
  );
}
