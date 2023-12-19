import React, { useEffect, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { ethers } from 'ethers';
import { useUtilsContext } from '../../contexts/UtilsContext';
import vTokenAbi from '../../services/json/vTokenABI.json';
import useContract, { getChain } from '../../services/useContract';
import { sendTransfer } from '../../services/wormhole/useSwap';
import { Button, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose, ControlsPlus, ShopCryptoCoin } from '@heathmont/moon-icons-tw';

export default function DonateCoin({ ideasid, show, onHide, address }) {
  const [Balance, setBalance] = useState('');
  const [CurrentChain, setCurrentChain] = useState('');
  const [CurrentChainNetwork, setCurrentChainNetwork] = useState(0);
  const [CurrentAddress, setCurrentAddress] = useState('');
  const [Coin, setCoin] = useState('DEV');
  const [isLoading, setisLoading] = useState(false);
  const [isSent, setisSent] = useState(false);
  const { sendTransaction } = useContract();
  const [showSwap, setshowSwap] = useState(false);

  let alertBox = null;
  const [transaction, setTransaction] = useState({
    link: '',
    token: ''
  });

  const { BatchDonate } = useUtilsContext();

  function ShowAlert(type = 'default', message) {
    console.log(alertBox);
    const pendingAlert = alertBox.children['pendingAlert'];
    const successAlert = alertBox.children['successAlert'];
    const errorAlert = alertBox.children['errorAlert'];

    alertBox.style.display = 'block';
    pendingAlert.style.display = 'none';
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    switch (type) {
      case 'pending':
        pendingAlert.querySelector('.MuiAlert-message').innerText = message;
        pendingAlert.style.display = 'flex';
        break;
      case 'success':
        successAlert.querySelector('.MuiAlert-message').innerText = message;
        successAlert.style.display = 'flex';
        break;
      case 'error':
        errorAlert.querySelector('.MuiAlert-message').innerText = message;
        errorAlert.style.display = 'flex';
        break;
    }
  }

  async function DonateCoinSubmission(e) {
    e.preventDefault();
    console.clear();
    setisSent(false);
    const { amount } = e.target;
    alertBox = e.target.querySelector('[name=alertbox]');
    setisLoading(true);
    if (Number(window.ethereum.networkVersion) === 1287) {
      //If it is sending from Moonbase so it will use batch precompiles
      ShowAlert('pending', 'Sending Batch Transaction....');
      await BatchDonate(amount.value, address, Number(ideasid), Coin);

      ShowAlert('success', 'Donation success!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      let output = await sendTransfer(Number(window.ethereum.networkVersion), amount.value, address, ShowAlert);
      setTransaction({
        link: output.transaction,
        token: output?.wrappedAsset
      });
      // Saving Donation count on smart contract
      await sendTransaction(await window.contract.populateTransaction.add_donation(Number(ideasid), ethers.utils.parseUnits(amount.value, 'gwei'), CurrentAddress));
    }

    // if (Number(window.ethereum.networkVersion) === 1287) {
    // 	setshowSwap(false);
    // } else {
    // 	setshowSwap(true);
    // }
    LoadData();
    setisLoading(false);
    setisSent(true);
  }

  const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.primary
  }));

  async function LoadData() {
    const Web3 = require('web3');
    const web3 = new Web3(window.ethereum);
    let Balance = await web3.eth.getBalance(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
    let token = ' ' + Coin;
    if (Coin !== 'DEV') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const tokenInst = new ethers.Contract(vTokenAbi.address, vTokenAbi.abi, provider);

      Balance = await tokenInst.balanceOf(window?.ethereum?.selectedAddress);
    }

    setBalance((Balance / 1000000000000000000).toFixed(5) + token);
    setCurrentChain(getChain(Number(window.ethereum.networkVersion)).name);
    setCurrentChainNetwork(Number(window.ethereum.networkVersion));
    setCurrentAddress(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
  }

  useEffect(() => {
    LoadData();
  }, [show, Coin]);

  return (
    <Modal open={show} onClose={onHide}>
      <Modal.Backdrop />
      <Modal.Panel>
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Donate coin</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onHide} />
          </div>
          <div className="flex flex-col gap-6 w-full p-6 max-h-[calc(90vh-162px)] overflow-auto">
            <form id="doanteForm" onSubmit={DonateCoinSubmission} autoComplete="off">
              <div name="alertbox" hidden>
                <Alert variant="filled" sx={{ my: 1 }} name="pendingAlert" severity="info">
                  Pending....
                </Alert>
                <Alert variant="filled" sx={{ my: 1 }} name="successAlert" severity="success">
                  Success....
                </Alert>
                <Alert variant="filled" sx={{ my: 1 }} name="errorAlert" severity="error">
                  Error....
                </Alert>
              </div>
              {isSent ? (
                <>
                  {showSwap ? (
                    <>
                      <StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
                        <div variant="standard">
                          <InputLabel sx={{ color: 'black' }}>Wrapped Token Address</InputLabel>
                          <a className="text-[#0000ff]">{transaction.token}</a>
                          <p>
                            Swap your token at{' '}
                            <a className="text-[#0000ff]" href="https://moonbeam-swap.netlify.app/#/swap" rel="noreferrer" target="_blank">
                              https://moonbeam-swap.netlify.app/#/swap
                            </a>
                          </p>
                        </div>
                      </StyledPaper>
                    </>
                  ) : (
                    <></>
                  )}

                  <StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
                    <div variant="standard" className="overflow-hidden">
                      <InputLabel sx={{ color: 'black' }}>Transaction</InputLabel>
                      <a href={transaction.link} className="text-[#0000ff]" rel="noreferrer" target="_blank">
                        {transaction.link}
                      </a>
                    </div>
                  </StyledPaper>
                </>
              ) : (
                <></>
              )}
              {CurrentChainNetwork !== 1287 ? (
                <>
                  <StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
                    <div variant="standard">
                      <InputLabel>Target Chain</InputLabel>
                      <span>Moonbase Alpha</span>
                    </div>
                  </StyledPaper>
                </>
              ) : (
                <></>
              )}

              <StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
                <div variant="standard">
                  <InputLabel>Target Address</InputLabel>
                  <span>{address}</span>
                </div>
              </StyledPaper>
              {CurrentChainNetwork !== 1287 ? (
                <>
                  <StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
                    <div variant="standard">
                      <InputLabel>From Chain</InputLabel>
                      <span>{CurrentChain}</span>
                    </div>
                  </StyledPaper>
                </>
              ) : (
                <>
                  <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                    <FormControl variant="standard" fullWidth>
                      <InputLabel>Coin</InputLabel>

                      <Select value={Coin} onChange={(e) => setCoin(e.target.value)}>
                        <MenuItem value="DEV" selected>
                          DEV
                        </MenuItem>
                        <MenuItem value="xcvGLMR">xcvGLMR</MenuItem>
                      </Select>
                    </FormControl>
                  </StyledPaper>
                </>
              )}
              <StyledPaper sx={{ my: 1, mx: 'auto', p: 2 }}>
                <div variant="standard">
                  <InputLabel>From Address</InputLabel>
                  <span>{CurrentAddress} (Your)</span>
                </div>
              </StyledPaper>
              <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                <FormControl variant="standard">
                  <InputLabel>Amount</InputLabel>
                  <Input name="amount" />
                </FormControl>
                <div>
                  <InputLabel>Balance</InputLabel>
                  <p>{Balance}</p>
                </div>
              </StyledPaper>
              <div className="flex justify-between border-t border-beerus w-full p-6">
                <Button variant="ghost" onClick={onHide}>
                  Cancel
                </Button>
                <Button type="submit" id="CreateGoalBTN">
                  <ShopCryptoCoin className="text-moon-24" />
                  Donate
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
