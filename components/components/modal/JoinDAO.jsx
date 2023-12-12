import React, { useState, useEffect } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { RouterConfig, chainMetadata } from '@hyperlane-xyz/sdk';

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ethers } from "ethers";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";

import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import { getChain } from "../../../services/useContract";
import Alert from "@mui/material/Alert";
import useContract from "../../../services/useContract";
import { useUtilsContext } from '../../../contexts/UtilsContext';
import { sendTransfer } from "../../../services/wormhole/useSwap";


export default function JoinDAO({ SubsPrice, show, onHide, address, title,dao_id }) {
	const [Balance, setBalance] = useState("");
	const [Token, setToken] = useState("");
	const [isLoading, setisLoading] = useState(false);
	const [isSent, setisSent] = useState(false);
	const [Amount, setAmount] = useState(0);
	const { contract, signerAddress, sendTransaction } = useContract()

	let alertBox = null;
	const [transaction, setTransaction] = useState({
		link: "",
		token: ""
	});


	const { BatchJoin, getUSDPriceForChain } = useUtilsContext();

	function ShowAlert(type = "default", message) {
		const pendingAlert = alertBox.children["pendingAlert"];
		const successAlert = alertBox.children["successAlert"];
		const errorAlert = alertBox.children["errorAlert"];

		alertBox.style.display = "block";
		pendingAlert.style.display = "none";
		successAlert.style.display = "none";
		errorAlert.style.display = "none";
		switch (type) {
			case "pending":
				pendingAlert.querySelector(".MuiAlert-message").innerText = message;
				pendingAlert.style.display = "flex";
				break;
			case "success":
				successAlert.querySelector(".MuiAlert-message").innerText = message;
				successAlert.style.display = "flex";
				break;
			case "error":
				errorAlert.querySelector(".MuiAlert-message").innerText = message;
				errorAlert.style.display = "flex";
				break;
		}
	}

	async function JoinSubmission(e) {
		e.preventDefault();
		console.clear();
		setisSent(false);
		const { amount } = e.target;
		alertBox = e.target.querySelector("[name=alertbox]");
		setisLoading(true);
		if (Number(window.ethereum.networkVersion) === 1287) {
			//If it is sending from Moonbase so it will use batch precompiles
			ShowAlert("pending", "Sending Batch Transaction....");
			await BatchJoin(amount.value, address, Number(dao_id));

			ShowAlert("success", "Purchased Subscription successfully!");
			setTimeout(() => {
				window.location.reload();
			}, 1000);

		} else {
			let output = await sendTransfer(Number(window.ethereum.networkVersion), amount.value, address, ShowAlert);
			setTransaction({
				link: output.transaction,
				token: output?.wrappedAsset
			});
			// Saving Joined Person on smart contract
			await sendTransaction(await window.contract.populateTransaction.join_community(dao_id, window?.ethereum?.selectedAddress?.toLocaleLowerCase()));
		}



		LoadData();
		setisLoading(false);
		setisSent(true);
	}
	const StyledPaper = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
		...theme.typography.body2,
		padding: theme.spacing(2),
		color: theme.palette.text.primary
	}));
	async function LoadData() {
		const Web3 = require("web3");
		const web3 = new Web3(window.ethereum);
		let Balance = await web3.eth.getBalance(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
		let token = " " + getChain(Number(window.ethereum.networkVersion)).nativeCurrency.symbol;
		setToken(token);
		setBalance((Balance / 1000000000000000000).toPrecision(5) + token);

		let UsdEchangePrice = await getUSDPriceForChain();
		let amount = (SubsPrice) / Number(UsdEchangePrice);
		setAmount(amount.toPrecision(5))
	}

	useEffect(() => {
		LoadData();
	}, [show]);

	return (
		<Dialog open={show} onClose={onHide} fullWidth="true" aria-labelledby="contained-modal-title-vcenter" centered="true">
			<DialogTitle>Join Community</DialogTitle>
			<DialogContent>
				<Container>
					<form id="doanteForm" onSubmit={JoinSubmission} autoComplete="off">
						<div name="alertbox" hidden="true">
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

								<StyledPaper sx={{ my: 1, mx: "auto", p: 2 }}>
									<div variant="standard" className="overflow-hidden">
										<InputLabel sx={{ color: "black" }}>Transaction</InputLabel>
										<a href={transaction.link} className="text-[#0000ff]" rel="noreferrer" target="_blank">
											{transaction.link}
										</a>
									</div>
								</StyledPaper>
							</>
						) : (
							<></>
						)}

						<StyledPaper sx={{ my: 1, mx: "auto", p: 2 }}>
							<div variant="standard">
								<InputLabel>DAO</InputLabel>
								<span>{title}</span>
							</div>
						</StyledPaper>

						<StyledPaper sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", my: 1, mx: "auto", p: 2 }}>
							<FormControl variant="standard">
								<InputLabel>Amount ({Token})</InputLabel>

								<Input name="amount" defaultValue={Amount} disabled onChange={(e) => setAmount(Number(e.target.value))} />
								<div>
									<p>Balance {Balance}</p>
								</div>
							</FormControl>
							<div style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center'
							}}>
								<InputLabel>USD</InputLabel>
								<p>${SubsPrice}</p>
							</div>
						</StyledPaper>

						<DialogActions>
							{Amount <= Balance ? (<><LoadingButton type="submit" name="JoinBTN" loading={isLoading} className="btn-secondary" size="medium">
								Join
							</LoadingButton></>) : (<>
							<span style={{color:"red"}}>
							Insufficent funds

							</span>
							</>)}

						</DialogActions>
					</form>
				</Container>
			</DialogContent>
		</Dialog>
	);
}
