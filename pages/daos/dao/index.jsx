import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';


import Head from "next/head"
import Image from "next/image"
import NavLink from "next/link"
import useContract from "../../../services/useContract"
import { Header } from "../../../components/layout/Header"
import isServer from "../../../components/isServer"
import styles from "../daos.module.css"
import Card from "../../../components/components/Card/Card"
import { ControlsPlus, ControlsChevronRight, ControlsChevronLeft } from "@heathmont/moon-icons-tw"
import { Button } from "@heathmont/moon-core-tw"
import Skeleton from "@mui/material/Skeleton"
import JoinDAO from "../../../components/components/modal/JoinDAO";
let running = true
export default function DAO() {
	//Variables
	const [list, setList] = useState([])
	const [DaoURI, setDaoURI] = useState({ Title: "", Description: "", SubsPrice: 0, Start_Date: "", End_Date: "", logo: "", wallet: "", typeimg: "", allFiles: [], isOwner: false })
	const [daoId, setDaoID] = useState(-1)
	const { contract, signerAddress } = useContract()
	const [JoinmodalShow, setJoinmodalShow] = useState(false);
	const [isJoined, setIsJoined] = useState(true)

	const sleep = milliseconds => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	const regex = /\[(.*)\]/g
	let m
	let id = "" //id from url

	useEffect(() => {
		fetchContractData();
	}, [contract])

	setInterval(function () {
		calculateTimeLeft()
	}, 1000)

	if (isServer()) return null
	const str = decodeURIComponent(window.location.search)

	while ((m = regex.exec(str)) !== null) {
		if (m.index === regex.lastIndex) {
			regex.lastIndex++
		}
		id = m[1]
	}
	function calculateTimeLeft() {
		//Calculate time left
		try {
			var allDates = document.getElementsByName("DateCount")
			for (let i = 0; i < allDates.length; i++) {
				var date = allDates[i].getAttribute("date")
				var status = allDates[i].getAttribute("status")
				allDates[i].innerHTML = LeftDate(date, status)
			}
		} catch (error) { }
	}

	async function JoinCommunity() {
		setJoinmodalShow(true);
	}

	const goal = (list) => list.map((listItem, index) => (
		<Card height={300} width={640} key={index} className="p-10">
			<div className="flex flex-col gap-8 w-full">
				<div className="flex gap-6 w-full">
					<span className={styles.image}>
						<img alt="" src={listItem.logo} />
					</span>
					<div className="flex flex-col gap-2 overflow-hidden text-left">
						<div className="font-bold">{listItem.Title}</div>
						<div>Budget {listItem.Budget}</div>
					</div>
				</div>
				<div className="flex justify-between align-center">
					<div name="DateCount" date={listItem.End_Date} status={listItem.status} className="flex items-center font-bold">
						{LeftDate(listItem.End_Date, listItem.status)}
					</div>

					<a href={`/daos/dao/goal?[${listItem.goalId}]`}>
						<Button iconleft={true}>
							<ControlsChevronRight />
							Go to Goal
						</Button>
					</a>
				</div>
			</div>
		</Card>
	))


	async function fetchContractData() {
		running = true;
		//Fetching data from Smart contract
		try {
			if (contract && id) {
				setDaoID(Number(id))

				//Load everything-----------
				const daoURI = JSON.parse(await contract.dao_uri(Number(id))) //Getting dao URI

				const totalGoals = await contract.get_all_goals_by_dao_id(Number(id)) //Getting all goals by dao id
				const arr = []
				for (let i = 0; i < Object.keys(totalGoals).length; i++) {
					//total dao number Iteration
					const goalid = await contract.get_goal_id_by_goal_uri(totalGoals[i])
					let goal = totalGoals[i];
					if (goal == "") continue;
					const object = JSON.parse(goal)

					if (object) {
						arr.push({
							//Pushing all data into array
							goalId: goalid,
							Title: object.properties.Title.description,
							Description: object.properties.Description.description,
							Budget: object.properties.Budget.description,
							End_Date: object.properties.End_Date.description,
							logo: object.properties.logo.description.url,
						})
					}
				}
				setList(arr)
				let daoURIShort = {
					Title: daoURI.properties.Title.description,
					Description: daoURI.properties.Description.description,
					Start_Date: daoURI.properties.Start_Date.description,
					logo: daoURI.properties.logo.description,
					wallet: daoURI.properties.wallet.description,
					typeimg: daoURI.properties.typeimg.description,
					allFiles: daoURI.properties.allFiles.description,
					SubsPrice: daoURI.properties?.SubsPrice?.description,
					isOwner: daoURI.properties.wallet.description.toString().toLocaleLowerCase() === signerAddress.toString().toLocaleLowerCase() ? true : false
				};
				setDaoURI(daoURIShort);
				let isJoined = await contract.is_person_joined(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
				setIsJoined(isJoined)

				const template_html = await contract._template_uris(Number(id));
				document.querySelector("#dao-container").innerHTML = template_html;
				if (document.querySelector(".btn-back") != null){
					document.querySelector(".btn-back").addEventListener('click', () => {
						window.history.back();
					});
					
				}
				let join_community_block = document.querySelector(".join-community-block");
				let create_goal_block = document.querySelector(".create-goal-block");
				if (create_goal_block != null) {
					document.querySelector(".create-goal-block").addEventListener('click', () => {
						window.location.href = `/CreateGoal?[${id}]`;
					});
				}

				if (join_community_block != null) {
					join_community_block.addEventListener('click', JoinCommunity);
				};

				if (daoURIShort.isOwner || isJoined) {
					if (join_community_block != null){

						join_community_block.style.display = "none";
					}
				} 
				if (!daoURIShort.isOwner ) {
					if (create_goal_block != null) {
						create_goal_block.style.display = "none";
					}
				}
				const root = createRoot(document.getElementById("goal-container"));


				root.render(goal(arr))


				/** TODO: Fix fetch to get completed ones as well */
				if (document.getElementById("Loading")) document.getElementById("Loading").style = "display:none";
			}
		} catch (error) {
			console.error(error);
		}
		running = false
	}

	function LeftDate(datetext, status) {
		//Counting Left date in date format
		var c = new Date(datetext).getTime()
		var n = new Date().getTime()
		var d = c - n
		var da = Math.floor(d / (1000 * 60 * 60 * 24))
		var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60))
		var s = Math.floor((d % (1000 * 60)) / 1000)
		if (s.toString().includes("-") && status === "Finished") {
			return "Dao Ended"
		}
		return da.toString() + " Days " + h.toString() + " hours " + m.toString() + " minutes " + s.toString() + " seconds" + " Left"
	}
	function Loader({ element, type = "rectangular", width = "50", height = "23" }) {
		if (running) {
			return <Skeleton variant={type} width={width} height={height} />
		} else {
			return element
		}
	}
	return (
		<>
			<Header></Header>
			<Head>
				<title>DAO</title>
				<meta name="description" content="DAO" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div id="dao-container">

			</div>

			{/* <div className={`${styles.container} flex items-center flex-col gap-8 relative`}>
				<div className={`${styles.title} gap-8 flex flex-col relative`}>
					<div>
						<h1 className="text-moon-32 font-bold" style={{ width: "78%" }}>
							{DaoURI.Title}
						</h1>
						<a
							style={{ width: "135px", position: "absolute", right: "1rem", top: "0" }}
							onClick={() => {
								window.history.back()
							}}>
							<Button iconleft style={{ width: "135px" }}>
								<ControlsChevronLeft />
								Back
							</Button>
						</a>
					</div>

					<div className={`${styles.tabs} flex gap-4`}>
						<NavLink href="?q=All">
							<a className="DonationBarLink tab block px-3 py-2 active">All</a>
						</NavLink>
						<NavLink href="?q=Today">
							<a className="DonationBarLink tab block px-3 py-2">Today</a>
						</NavLink>
						<NavLink href="?q=This Month">
							<a className="DonationBarLink tab block px-3 py-2">This Month</a>
						</NavLink>
						{DaoURI.isOwner ? (
							<a href={`/CreateGoal?[${daoId}]`}>
								<Button style={{ width: "150px", position: "absolute", right: "1rem" }} iconLeft>
									<ControlsPlus className="text-moon-24" />
									<div className="card BidcontainerCard">
										<div className="card-body bidbuttonText">Create Goal</div>
									</div>
								</Button>
							</a>
						) : (
							!isJoined?(<><Button style={{ width: "140px", position: "absolute", right: "1rem" }} onClick={JoinCommunity} >
							<div className="card BidcontainerCard">
								<div className="card-body bidbuttonText">Join Community</div>
							</div>
						</Button></>):(<></>) 
							
						)}
					</div>
				</div>

				<div className={styles.divider}></div>
				<Loader
					element={
						<div className="flex flex-col gap-8">
							<img src={DaoURI.logo.url} />
						</div>
					}
					width="90%"
					height={578}
				/>
				<Loader
					element={
						<div className="flex flex-col gap-8">
							{list.map((listItem, index) => (
								<Card height={300} width={640} key={index} className="p-10">
									<div className="flex flex-col gap-8 w-full">
										<div className="flex gap-6 w-full">
											<span className={styles.image}>
												<img alt="" src={listItem.logo} />
											</span>
											<div className="flex flex-col gap-2 overflow-hidden text-left">
												<div className="font-bold">{listItem.Title}</div>
												<div>Budget {listItem.Budget}</div>
											</div>
										</div>
										<div className="flex justify-between align-center">
											<div name="DateCount" date={listItem.End_Date} status={listItem.status} className="flex items-center font-bold">
												{LeftDate(listItem.End_Date, listItem.status)}
											</div>

											<a href={`/daos/dao/goal?[${listItem.goalId}]`}>
												<Button iconleft={true}>
													<ControlsChevronRight />
													Go to Goal
												</Button>
											</a>
										</div>
									</div>
								</Card>
							))}
						</div>
					}
					width="90%"
					height={578}
				/>
			</div> */}
			<JoinDAO
				SubsPrice={DaoURI.SubsPrice}
				show={JoinmodalShow}
				onHide={() => {
					setJoinmodalShow(false);
				}}
				address={DaoURI.wallet}
				title={DaoURI.Title}
				dao_id={daoId}
			/>
		</>
	)
}
