import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { OCR2Feed } from "@chainlink/solana-sdk";
import { PublicKey } from "@solana/web3.js";

const ChainlinkPriceFeed = () => {
  const [price, setPrice] = useState<number>();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) {
      console.log("Wallet not connected");
      return;
    }

    const CHAINLINK_FEED_ADDRESS = "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
    const CHAINLINK_PROGRAM_ID = new PublicKey("cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ");
    const feedAddress = new PublicKey(CHAINLINK_FEED_ADDRESS);

    let dataFeed;
    let listener;

    const subscribeToPriceFeed = async () => {
      try {
        dataFeed = await OCR2Feed.load(CHAINLINK_PROGRAM_ID, { connection });

        listener = dataFeed.onRound(feedAddress, (event) => {
          const rawPrice = event.answer.toNumber();
          const decimals = 8; // This should be set based on the actual decimals used by the price feed
          const priceInDollars = rawPrice / Math.pow(10, decimals);
          const formattedPrice = parseFloat(priceInDollars.toFixed(2)); // Limit to 2 decimal places and convert back to number
          setPrice(formattedPrice);
        });
      } catch (error) {
        console.error("Failed to subscribe to Chainlink Price Feed:", error);
      }
    };

    subscribeToPriceFeed();

    return () => {
      if (listener && dataFeed) {
        dataFeed.removeListener(listener);
      }
    };
  }, [publicKey, connection]);

  return <div>{price ? `$${price}` : "Loading..."}</div>;
};

export default ChainlinkPriceFeed;
