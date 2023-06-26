"use client";
import TokenListItem from "@/components/tokenListItem";
import useAirdropLists from "@/hooks/useAirdropList";
import useLocalStorage from "@/hooks/useLocalStorage";
import useTokenLists from "@/hooks/useTokenLists";
import { trimAddress } from "@/utils";
import Image from "next/image";
import Link from "next/link";

// to do
// create token -> show info & cta to add to metamaskk & link to block explorer & link to mit page
// add to local storage
// airdrop -> dynamic link
// local storage
// polygon
// arbitrum

export default function Home() {
  const [airdropList] = useAirdropLists();
  const [tokenList] = useTokenLists();

  return (
    <main className=" min-h-screen  w-full">
      <div className="flex mt-32 flex-col items-center justify-center w-full">
        <h2 className="text-7xl font-bold text-center w-full whitespace-nowrap">
          Welcome to the
        </h2>
        <h1 className="text-yehlow-400 text-9xl text-center font-bold w-full">
          Minting Lab
        </h1>
      </div>
      <div className="w-full mx-auto mt-28">
        <div className="text-2xl font-bold gap-4 text-center justify-center w-full flex">
          <Link href="/create">
            <div className="bg-yehlow-500 text-black text-xl capitalize m-2 rounded-md border-1 border-solid border-white px-14 py-8">
              Create Token
            </div>
          </Link>
          <Link href="/airdrop">
            <div className="bg-yehlow-500 text-black text-xl capitalize m-2 rounded-md border-1 border-solid border-white px-14 py-8">
              Create Airdrop
            </div>
          </Link>
        </div>
        <div className="grid w-full mt-9 border-solid border-white  px-3 grid-cols-2 gap-1">
          <div className="w-full flex flex-col items-center">
            <h5 className="text-4xl mb-10 font-bold text-center max-w-lg">
              Airdrops Created
            </h5>
            <div className="text-2xl font-bold text-center max-w-lg">
              {airdropList &&
                airdropList.map((item, index) => {
                  return (
                    <div key={index}>
                      <p className="text-xl font-bold">{item}</p>
                      <Link
                        className="underline text-xs text-yehlow-400 hover:text-yehlow-500 focus:text-yellow-200"
                        href={`/claim/${item}`}
                      >
                        Claim Page
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <h5 className="text-4xl mb-10 font-bold text-center max-w-lg">
              Tokens Created
            </h5>
            <div className="text-2xl font-bold text-center max-w-lg">
              {tokenList &&
                tokenList.map((item, index) => {
                  return <TokenListItem tokenAddress={item} key={index} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
