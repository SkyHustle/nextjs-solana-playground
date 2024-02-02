"use client";

import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import { useParams } from "next/navigation";
import AccountDetails from "@/components/account/account-details";
import { AccountTransactions } from "@/components/account/account-transactions";

export default function AccountDetailFeature() {
  const params = useParams();
  const address = useMemo(() => {
    if (!params.address) {
      return;
    }
    try {
      return new PublicKey(params.address);
    } catch (e) {
      console.log(`Invalid public key`, e);
    }
  }, [params]);
  if (!address) {
    return <div>Error loading account</div>;
  }

  return (
    <>
      <AccountDetails address={address} />
      <AccountTransactions address={address} />
    </>
  );
}
