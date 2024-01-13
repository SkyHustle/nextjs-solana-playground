"use client";
import { NextPage } from "next";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";

const Home: NextPage = () => {
    const endpoint = clusterApiUrl("devnet");
    const wallet = new PhantomWalletAdapter();

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[wallet]}>
                {wallet.connected ? <div>Wallet Connected</div> : <div> Wallet Not connected</div>}
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Home;
