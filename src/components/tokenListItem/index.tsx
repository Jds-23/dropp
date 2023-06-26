import { trimAddress } from "@/utils";
import Link from "next/link";
import React from "react";
import { useToken } from "wagmi";

const TokenListItem = ({ tokenAddress }: { tokenAddress: string }) => {
  const { data: tokenData, isLoading } = useToken({
    address: `0x${tokenAddress.replace(/^0x/, "")}`,
  });
  if (isLoading && tokenData !== undefined) return <div>Loading...</div>;

  return (
    <div>
      <p className="text-xl font-bold">
        {tokenData?.symbol}({trimAddress(tokenAddress)})
      </p>
      <div className="flex justify-evenly w-full">
        <Link
          className="underline text-xs text-yehlow-400 hover:text-yehlow-500 focus:text-yellow-200"
          href={`/token/${tokenAddress}`}
        >
          Mint
        </Link>
        <Link
          className="underline text-xs text-yehlow-400 hover:text-yehlow-500 focus:text-yellow-200"
          href={`/airdrop?token=${tokenAddress}`}
        >
          Create Dropp
        </Link>
      </div>
    </div>
  );
};

export default TokenListItem;
