import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import LotteryEntrance from "../components/lotteryEntrance"
export default function Home() {
    return (
        <>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our smart contract lottery" />
            </Head>
            <Header></Header>
            <LotteryEntrance></LotteryEntrance>
        </>
    )
}
