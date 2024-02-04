import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";

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