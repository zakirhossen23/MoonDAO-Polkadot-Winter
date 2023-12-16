import { Button } from "@heathmont/moon-core-tw"
import { ControlsChevronRight, GenericEdit } from "@heathmont/moon-icons-tw"
import Skeleton from "@mui/material/Skeleton"
import Head from "next/head"
import NavLink from "next/link"
import React, { useEffect, useState } from "react"
import Card from "../../components/components/Card/Card"
import useContract from "../../services/useContract"
import styles from "./daos.module.css"

let running = true
export default function DAOs() {
	//Variables
	const [list, setList] = useState([])
	const { contract } = useContract()

	useEffect(() => {
		fetchContractData()
	}, [contract])

	setInterval(function () {
		calculateTimeLeft()
	}, 1000)

	function calculateTimeLeft() {
		//Calculate time left
		try {
			var allDates = document.getElementsByName("DateCount")
			for (let i = 0; i < allDates.length; i++) {
				var date = allDates[i].getAttribute("date")
				var status = allDates[i].getAttribute("status")
				allDates[i].innerHTML = LeftDate(date, status)
			}
		} catch (error) {}
	}

	async function fetchContractData() {
		running = true
		//Fetching data from Smart contract
		try {
			if (contract) {
				const totalDao = await contract.get_all_daos() //Getting total dao (Number)
				const arr = []
				for (let i = 0; i < Object.keys(totalDao).length; i++) {
					//total dao number Iteration
					const object = JSON.parse(totalDao[i])

					if (object) {
						arr.push({
							//Pushing all data into array
							daoId: i,
							Title: object.properties.Title.description,
							Start_Date: object.properties.Start_Date.description,
							logo: object.properties.logo.description?.url,
							wallet: object.properties.wallet.description,
							SubsPrice: object.properties?.SubsPrice?.description,
						})
					}
				}
				setList(arr)
				/** TODO: Fix fetch to get completed ones as well */
				if (document.getElementById("Loading"))  document.getElementById("Loading").style = "display:none";
			}
		} catch (error) {
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
		return da.toString() + " Days " + h.toString() + " hours " + m.toString() + " minutes " + s.toString() + " seconds" + "Left"
	}
	function Loader({ element, type = "rectangular", width = "50", height = "23", many=1 }) {
		if (running) {
      let allElements = [];
      for (let i=0; i < many; i++){
        allElements.push( <Skeleton variant={type} width={width} height={height} />)
      }
      return allElements;
		} else {
      return element;
		}
	}
	return <>
        <Head>
            <title>DAO</title>
            <meta name="description" content="DAO" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={`${styles.container} flex items-center flex-col gap-8`}>
            <div className={`${styles.title} gap-8 flex flex-col`}>
                <h1 className="text-moon-32 font-bold">All DAO</h1>

                <div className={`${styles.tabs} flex gap-4`}>
                    <NavLink href="?q=All" className="DonationBarLink tab block px-3 py-2 active">
                        All
                    </NavLink>
                    <NavLink href="?q=Today" className="DonationBarLink tab block px-3 py-2">
                        Today
                    </NavLink>
                    <NavLink href="?q=This Month" className="DonationBarLink tab block px-3 py-2">
                        This Month
                    </NavLink>
                </div>
            </div>

            <div className={styles.divider}></div>
    <div className="flex flex-col gap-8">
            <Loader
                element={
                        list.map((listItem, index) => (
                            <Card height={300} width={640} key={index} className="p-10">
                                <div className="flex flex-col gap-8 w-full">
                                    <div className="flex gap-6 w-full">
                                        <span className={styles.image}>
                                            <img alt="" src={listItem.logo} />
                                        </span>
                                        <div className="flex flex-col gap-2 overflow-hidden text-left">
                                            <div className="font-bold">{listItem.Title}</div>
                                            <div className="whitespace-nowrap truncate">
                                                Organised by&nbsp;
                                                {listItem.wallet != window?.accountId ? listItem.wallet : <>(Me)</>}
                                            </div>
                                            <div className="whitespace-nowrap truncate">
                                                Subscription :
                                                ${listItem.SubsPrice }/mo
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex align-center flex justify-end align-center gap-2">
                                    <a href={`/DesignDao?[${listItem.daoId}]`}>
                                            <Button iconleft="true">
                                                <GenericEdit />
                                                Customize
                                            </Button>
                                        </a>
                                        <a href={`/daos/dao?[${listItem.daoId}]`}>
                                            <Button iconleft="true">
                                                <ControlsChevronRight />
                                                Go to Dao
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </Card>
                        ))
                }
                width={640}
                height={300}
      many={3}
      type='rounded'
            />	</div>
        </div>
    </>;
}
