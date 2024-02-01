import {
  AtSymbolIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import { PublicKey } from "@solana/web3.js";

export default function AccountDetails({ address }: { address: string }) {
  return (
    <div className="lg:flex lg:items-center lg:justify-between p-5">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          SOL Balance
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <AtSymbolIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <ExplorerLink path={address} label={ellipsify(address.toString())} />
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            in USD
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PaperAirplaneIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Airdrop
          </button>
        </span>

        <span className="ml-3 sm:block">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowUpIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Send
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

export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
  return (
    <a
      href={`https://explorer.solana.com/address/${path}?cluster=devnet`}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + "...." + str.substring(str.length - len, str.length);
  }
  return str;
}
