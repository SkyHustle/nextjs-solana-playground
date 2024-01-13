"use client";
import { NextPage } from "next";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";

const Home: NextPage = (props) => {
    const endpoint = clusterApiUrl("devnet");
    const wallet = new PhantomWalletAdapter();

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[wallet]}>
                <WalletModalProvider>
                    <WalletMultiButton />
                    <p>Put the rest of your app here</p>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Home;
