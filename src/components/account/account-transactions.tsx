import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { ExplorerLink, Ellipsify } from "../ui/link-display";
import { useGetSignatures } from "@/hooks/account";

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address });

  const items = useMemo(() => {
    return query.data;
  }, [query.data]);

  return (
    <div className="py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Transaction History</h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {query.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => query.refetch()}
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {query.isError && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}

      {query.isSuccess && query.data.length === 0 ? (
        <div className="text-base font-semibold leading-6 text-gray-900">No transactions found.</div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Signature
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Slot
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Block Time
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items?.map((item) => (
                    <tr key={item.signature}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <ExplorerLink path={`tx/${item.signature}`} label={Ellipsify(item.signature, 8)} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <ExplorerLink path={`block/${item.slot}`} label={item.slot.toString()} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date((item.blockTime ?? 0) * 1000).toISOString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.err ? (
                          <div className="badge badge-error" title={JSON.stringify(item.err)}>
                            Failed
                          </div>
                        ) : (
                          <div className="badge badge-success">Success</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
