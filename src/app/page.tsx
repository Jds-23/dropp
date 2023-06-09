import Image from 'next/image'
import Link from 'next/link'

// to do
// create token -> show info & cta to add to metamaskk & link to block explorer & link to mit page
// add to local storage
// airdrop -> dynamic link
// local storage 
// polygon
// arbitrum

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-center max-w-lg">
          Welcome to the
          <br />
          <span className="text-blue-500">Minting Lab</span>
        </div>
        <div className="mt-8">
          {/* <Image


            src="/minting-lab.png"
            alt="Minting Lab"
            width={500}
            height={500}
          /> */}
          💨💧
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl font-bold gap-4 text-center max-w-lg w-full grid-cols-4">
            <Link href="/create">
          <div className='bg-blue-500 m-2 rounded-md border-1 border-solid border-white p-3'>
Create Token
          </div>
            </Link>
            <Link href="/airdrop">
          <div className='bg-blue-500 m-2 rounded-md border-1 border-solid border-white p-3'>
Create Airdrop
          </div>
            </Link>
          
        </div>
        </div>
    </main>
  )
}
