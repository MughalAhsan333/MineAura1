'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useUserRegistration } from '../hooks/useUserRegistration'

export default function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isRegistered, loading } = useUserRegistration()

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-sm block">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          {loading ? (
            <span className="text-xs text-yellow-500">Registering...</span>
          ) : isRegistered ? (
            <span className="text-xs text-green-500">Registered ✓</span>
          ) : null}
        </div>
        <button onClick={() => disconnect()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => connect({ connector: connectors[0] })} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Connect Wallet
    </button>
  )
}