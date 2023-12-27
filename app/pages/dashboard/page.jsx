"use client"

import { useEffect,useState  } from 'react';
import { useRouter } from 'next/navigation';
import {ethers} from 'ethers';
import * as CryptoJS from 'crypto-js';
import { JsonRpcProvider  } from 'ethers';
import { Triangle } from 'react-loader-spinner'

import styles from './dashboard.module.css';

const Dashboard = () => {
  const router = useRouter();
  const [ethBalance, setEthBalance] = useState(null);
  const [address, setAdrress] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const clearAuthToken = () => {
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    const authToken = getAuthToken();
    if (!authToken) {
      router.push('/pages/login');
    }else{
        fetchEthBalance();

        const refreshInterval = setInterval(() => {
            fetchEthBalance();
          }, 2000);
    
          return () => clearInterval(refreshInterval);
    }
  }, []);

  const fetchEthBalance = async () => {
    try {
      const authToken = getAuthToken();
      const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');

      const password = authToken;
      const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
      const decryptedMnemonic = bytes.toString(CryptoJS.enc.Utf8);

      const provider = new JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/10GoPIq0B14eeFn43MzeqjMrxliwbCYz');
      const wallet = ethers.Wallet.fromPhrase(decryptedMnemonic,provider);
      setAdrress(wallet.address);
      const balance = await provider.getBalance(wallet.address);

      setEthBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
    }
  };

  const handleSendETH = async (event) => {
    event.preventDefault();

    try {
      const authToken = getAuthToken();
      const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
      const password = authToken; 
      const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
      const decryptedMnemonic = bytes.toString(CryptoJS.enc.Utf8);
      const provider = new JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/10GoPIq0B14eeFn43MzeqjMrxliwbCYz');
      const wallet = ethers.Wallet.fromPhrase(decryptedMnemonic,provider);

      setIsOpen(true);

      const transaction = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amountToSend),
      });

      setTransactionHash(transaction.hash);
    } catch (error) {
      console.error('Error sending ETH:', error);
      setIsOpen(false);
    }
  };

  const onTransactionDone = () => {
    setTransactionHash(null);
    setIsOpen(false);
  };

  const handleLogout = () => {
    clearAuthToken();
    router.push('/pages/login');
  };

  return (
    <div>
                <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <h3 className="text-xl font-bold mb-8">{address}</h3>

      {/* ETH balance */}
      <p className="text-lg mb-4">
        <span className="font-bold">ETH Balance:</span> {ethBalance}
      </p>

      {/* Send ETH form */}
      <form onSubmit={handleSendETH} className="mb-8">
        <label className="block mb-4">
          Recipient Address:
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="border rounded w-full p-2"
            style={{ color: "black" }}
            required
          />
        </label>

        <label className="block mb-4">
          Amount to Send (ETH):
          <input
            type="text"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
            className="border rounded w-full p-2"
            style={{ color: "black" }}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Send ETH
        </button>
      </form>

 
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

    </div>

    <div className={isOpen ? styles.modalOverlay : ''}>

     </div>

      <dialog style={{zIndex:1000,marginTop: "-20%",position:"fixed"}} open={isOpen} className="rounded-lg shadow-md p-8">
            {!transactionHash ? (
            
            <div>
                <h2 className="text-lg font-bold mb-6" style={{ fontSize: '1.6em' }}>Processing Transaction</h2>
                <div className="flex justify-center">
                <Triangle
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />

            </div>
            </div>
            
            ):
            // Display transaction hash after sending ETH 
            <div className='flex justify-center'>
                <p className="mb-4">
                    <span className="font-bold">Transaction Hash:</span> {transactionHash}
                </p>
                <button style={{ fontSize: '1em' }} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700" onClick={onTransactionDone}>Close</button>
            </div>

            }
      </dialog>

    </div>
  );
};

export default Dashboard;
