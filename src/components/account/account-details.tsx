import { useState } from "react";
import {
  AtSymbolIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import ChainlinkPriceFeed from "@/components/chainlink/sol-usd-price-feed";
import { ExplorerLink, Ellipsify } from "@/components/ui/link-display";
import { TransactionModal } from "@/components/ui/transaction-modal";
import { useRequestAirdrop, useGetBalance, useTransferSol } from "@/hooks/account";

export default function AccountDetails({ address }: { address: PublicKey }) {
  const [showAirdropModal, setShowAirdropModal] = useState(false);
  const [airdropAmount, setAirdropAmount] = useState("");
  const airdropMutation = useRequestAirdrop({ address });

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const transferSolMutation = useTransferSol({ address });

  function handleRequestAirdrop() {
    console.log(`Requesting airdrop of ${airdropAmount} SOL to ${address.toString()}`);
    airdropMutation.mutateAsync(parseFloat(airdropAmount)).then(() => {
      setAirdropAmount("");
      setShowAirdropModal(false);
    });
  }

  function handleSendSol() {
    console.log(`Sending ${transferAmount} SOL to ${transferAddress}`);
    transferSolMutation
      .mutateAsync({
        destination: new PublicKey(transferAddress),
        amount: parseFloat(transferAmount),
      })
      .then(() => {
        setTransferAmount("");
        setTransferAddress("");
        setShowTransferModal(false);
      });
  }

  return (
    <div className="lg:flex lg:items-center lg:justify-between pt-8 pb-8">
      <div className="min-w-0 flex-1">
        <AccountBalance address={address} />
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <AtSymbolIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <ExplorerLink path={`account/${address.toString()}`} label={Ellipsify(address.toString())} />
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <ChainlinkPriceFeed />
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setShowAirdropModal(true)}
          >
            <PaperAirplaneIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Airdrop
            <TransactionModal hide={() => setShowAirdropModal(false)} show={showAirdropModal}>
              <div>
                <div>
                  <div className="mx-auto flex items-center justify-center">
                    <PaperAirplaneIcon className="-ml-0.5 mr-1.5 h-7 w-7 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h2 className="text-base font-semibold leading-6 text-gray-900">Airdrop</h2>
                    <div className="mt-2">
                      <div>
                        <input
                          type="number"
                          step="any"
                          name="amount"
                          id="amount"
                          min="1"
                          value={airdropAmount}
                          onChange={(e) => setAirdropAmount(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="How many SOL to airdrop?"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleRequestAirdrop}
                  >
                    Request Airdrop
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
                    onClick={() => setShowAirdropModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </TransactionModal>
          </button>
        </span>

        <span className="ml-3 sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setShowTransferModal(true)}
          >
            <ArrowUpIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Send
            <TransactionModal hide={() => setShowTransferModal(false)} show={showTransferModal}>
              <div>
                <div>
                  <div className="mx-auto flex items-center justify-center">
                    <ArrowUpIcon className="-ml-0.5 mr-1.5 h-7 w-7 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h2 className="text-base font-semibold leading-6 text-gray-900">Send Sol</h2>
                    <div className="mt-2">
                      <div>
                        <input
                          type="number"
                          step="any"
                          name="send-amount"
                          id="send-amount"
                          min="1"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="How many SOL to send?"
                        />
                      </div>
                      <div className="pt-4">
                        <input
                          type="text"
                          name="send-to"
                          id="send-to"
                          value={transferAddress}
                          onChange={(e) => setTransferAddress(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Address or Public Key to send to..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleSendSol}
                  >
                    Send Sol
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
                    onClick={() => setShowTransferModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </TransactionModal>
          </button>
        </span>

        <span className="ml-3 sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowDownIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Receive
          </button>
        </span>
      </div>
    </div>
  );
}

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance(address);

  if (query.isLoading) {
    return <h2>Loading...</h2>;
  }

  if (query.error) {
    console.log(`Error fetching balance`, query.error.message);
    return <h2>Error Fetching Balance...</h2>;
  }

  return (
    <div>
      <h2
        className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight cursor-pointer"
        onClick={() => query.refetch()}
      >
        {query.data ? <span>{Math.round((query.data / LAMPORTS_PER_SOL) * 100000) / 100000}</span> : "..."} SOL
      </h2>
    </div>
  );
}
