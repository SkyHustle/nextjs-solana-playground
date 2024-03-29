import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";

export function useGetBalance(address: PublicKey) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ["get-balance", { endpoint: connection.rpcEndpoint, address }],
    queryFn: () => connection.getBalance(address),
  });
}

export function useRequestAirdrop({ address }: { address: PublicKey }) {
  const { connection } = useConnection();
  // const transactionToast = useTransactionToast();
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["airdrop", { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (amount: number = 1) => {
      const [latestBlockhash, signature] = await Promise.all([
        connection.getLatestBlockhash(),
        connection.requestAirdrop(address, amount * LAMPORTS_PER_SOL),
      ]);

      await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");
      return signature;
    },
    onSuccess: (signature) => {
      // transactionToast(signature);
      return Promise.all([
        client.invalidateQueries({
          queryKey: ["get-balance", { endpoint: connection.rpcEndpoint, address }],
        }),
        client.invalidateQueries({
          queryKey: ["get-signatures", { endpoint: connection.rpcEndpoint, address }],
        }),
      ]);
    },
    onError: (error) => {
      console.error(`Error requesting airdrop`, error);
    },
  });
}

export function useGetSignatures({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ["get-signatures", { endpoint: connection.rpcEndpoint, address }],
    queryFn: () => connection.getConfirmedSignaturesForAddress2(address),
  });
}

export function useTransferSol({ address }: { address: PublicKey }) {
  const { connection } = useConnection();
  //   const transactionToast = useTransactionToast();
  const wallet = useWallet();
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["transfer-sol", { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (input: { destination: PublicKey; amount: number }) => {
      let signature: TransactionSignature = "";
      try {
        const { transaction, latestBlockhash } = await createTransaction({
          publicKey: address,
          destination: input.destination,
          amount: input.amount,
          connection,
        });

        // Send transaction and await for signature
        signature = await wallet.sendTransaction(transaction, connection);

        // Send transaction and await for signature
        await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");

        console.log(signature);
        return signature;
      } catch (error: unknown) {
        console.log("error", `Transaction failed! ${error}`, signature);

        return;
      }
    },
    onSuccess: (signature) => {
      if (signature) {
        // transactionToast(signature);
        console.log("Transaction successful", signature);
      }
      return Promise.all([
        client.invalidateQueries({
          queryKey: ["get-balance", { endpoint: connection.rpcEndpoint, address }],
        }),
        client.invalidateQueries({
          queryKey: ["get-signatures", { endpoint: connection.rpcEndpoint, address }],
        }),
      ]);
    },
    onError: (error) => {
      //   toast.error(`Transaction failed! ${error}`);
      console.error(`Error transferring SOL`, error);
    },
  });
}

async function createTransaction({
  publicKey,
  destination,
  amount,
  connection,
}: {
  publicKey: PublicKey;
  destination: PublicKey;
  amount: number;
  connection: Connection;
}): Promise<{
  transaction: VersionedTransaction;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
}> {
  // Get the latest blockhash to use in our transaction
  const latestBlockhash = await connection.getLatestBlockhash();

  // Create instructions to send, in this case a simple transfer
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: destination,
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  ];

  // Create a new TransactionMessage with version and compile it to legacy
  // Compiling it to a "legacy message" ensures compatibility with different versions of the Solana runtime
  const messageLegacy = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions,
  }).compileToLegacyMessage();

  // Create a new VersionedTransaction which supports legacy and v0
  // Wrapping the message in a VersionedTransaction object allows for transactions that are compatible with multiple versions of the Solana network. This is important for maintaining forward compatibility and ensuring that transactions can be processed by nodes running different versions of the software.
  const transaction = new VersionedTransaction(messageLegacy);

  return {
    transaction,
    latestBlockhash,
  };
}
