'use client'

import dynamic from 'next/dynamic'

// Dynamically import components that use wallet connection (client-side only)
const ConnectWallet = dynamic(() => import('../components/ConnectWallet'), { ssr: false })
const AdminLink = dynamic(() => import('../components/AdminLink'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">MineAura</h1>
        <div className="flex items-center gap-4">
          <AdminLink />
          <ConnectWallet />
        </div>
      </div>

      <div className="relative flex place-items-center">
        <div className="text-center">
          <h2 className="text-6xl font-bold mb-8">
            The Future of <span className="text-blue-600">Points Mining</span> is Here
          </h2>
          <p className="text-xl mb-8">
            Join MineAura today. Earn points through referrals, invest in miners, and climb the ranks.
          </p>
          <p className="text-gray-500">Connect your wallet to get started</p>
        </div>
      </div>
    </main>
  )
}
