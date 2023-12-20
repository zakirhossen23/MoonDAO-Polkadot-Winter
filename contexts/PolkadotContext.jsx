'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import polkadotConfig from './json/polkadot-config.json';
import { toast } from 'react-toastify';

const AppContext = createContext({
  api: null,
  deriveAcc:null,
  showToast:(status,id,FinalizedText,doAfter,callToastSuccess= true, events)=>{}
});

export function PolkadotProvider({ children }) {
  const [api, setApi] = useState();
  const [deriveAcc, setDeriveAcc] = useState(null)

  async function showToast(status,id,FinalizedText,doAfter,callToastSuccess= true, events){
 
   if (status.isInBlock) {
      toast.update(id, { render: "Transaction In block...", isLoading: true });

    }else if (status.isFinalized) {
      if (callToastSuccess)
      toast.update(id, { render: FinalizedText, type: "success", isLoading: false });
      doAfter(events);
    }
  }


  useEffect(() => {
    (async function () {
      const wsProvider = new WsProvider(polkadotConfig.chain_rpc);
      const api = await ApiPromise.create({ provider: wsProvider });
      await api.isReady;

      setApi(api);

      const keyring = new Keyring({ type: 'sr25519' });
      const newPair = keyring.addFromUri(polkadotConfig.derive_acc);
      setDeriveAcc(newPair)

    })();
  },[])


  return <AppContext.Provider value={{api:api,deriveAcc:deriveAcc,showToast:showToast}}>{children}</AppContext.Provider>;
}

export const usePolkadotContext = () => useContext(AppContext);
