import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const dispatch = useNotification()

    const [entranceFee, setEntraneFee] = useState("0")
    const [NumPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const {
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: parseInt(entranceFee),
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    async function UpdateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setEntraneFee(entranceFeeFromCall)
        const NumPlayers = (await getNumberOfPlayers()).toString()
        setNumPlayers(NumPlayers)
        const recentWinner = (await getRecentWinner()).toString()
        setRecentWinner(recentWinner)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            UpdateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (Tx) => {
        await Tx.wait(1)
        HandleNewNotification(Tx)
        UpdateUI()
    }

    function HandleNewNotification() {
        dispatch({
            type: "success",
            title: "Transaction Notification",
            message: "Transaction Completed!",
            position: "topR",
        })
    }
    return (
        <div>
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                // onComplete,
                                onError: (e) => console.log(e),
                                onSuccess: handleSuccess,
                            })
                        }}
                        disabled={isFetching || isLoading}
                    >
                        {isFetching || isLoading ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Participate Now!</div>
                        )}
                    </button>
                    <div> Entrance Fee is : {ethers.utils.formatEther(entranceFee)} ETH</div>
                    <div> Number of players : {NumPlayers} </div>
                    <div>The most previous winner was : {recentWinner} </div>
                </div>
            ) : (
                <div>Please connect to a supported chain</div>
            )}
        </div>
    )
}
