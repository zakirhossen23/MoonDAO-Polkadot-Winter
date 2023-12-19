import Head from 'next/head';
import { useEffect, useState } from 'react';
import LoginCard from '../../components/components/LoginCard';
import { useRouter } from 'next/router';

export default function Login() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [step, setStep] = useState(1);

  const router = useRouter();

  const setConnectionStatus = () => {
    if (window.ethereum) {
      setHasMetamask(true);
    }

    if (window.localStorage.getItem('login-type') === 'metamask') {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    setConnectionStatus();
  }, []);

  useEffect(() => {
    if (hasMetamask && isConnected) {
      window.location.href = '/daos';
    }
  }, [hasMetamask, isConnected, router]); // Dependency array

  async function onClickConnect() {
    setStep(2);

    if (!hasMetamask) {
      window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');
      return;
    }

    let result = await window.ethereum.request({ method: 'eth_requestAccounts' });
    result;

    try {
      const getacc = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x507' }] //1287
      });
      getacc;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x507', //1287
                chainName: 'Moonbeam Alpha',
                nativeCurrency: {
                  name: 'DEV',
                  symbol: 'DEV',
                  decimals: 18
                },
                rpcUrls: ['https://rpc.api.moonbase.moonbeam.network']
              }
            ]
          });
        } catch (addError) {
          // handle "add" error
          console.log(addError);
        }
      }
      // handle other "switch" errors
    }

    window.localStorage.setItem('loggedin', 'true');
    window.localStorage.setItem('login-type', 'metamask');

    setIsConnected(true);
    setHasMetamask(true);
  }
  async function onClickDisConnect() {
    window.localStorage.setItem('loggedin', 'false');
    window.localStorage.setItem('login-type', '');

    setIsConnected(false);
    setHasMetamask(false);
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="PlanetDAO - Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`gap-8 flex w-full bg-gohan pt-10 pb-6 border-beerus border`}>
        <div className="container flex flex-col gap-2 w-full justify-between">
          <h1 className="text-moon-32 font-bold">Login to your account</h1>
          <p>Step {step} of 2</p>
        </div>
      </div>
      <div className="container flex flex-col items-center pt-10 gap-10">{<LoginCard step={step} onConnect={onClickConnect} onDisconnect={onClickDisConnect} />}</div>
    </>
  );
}
