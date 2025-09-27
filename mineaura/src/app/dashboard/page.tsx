'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import MinerShop from '../../components/MinerShop'

interface User {
  wallet_address: string
  referral_code: string
  total_points: number
  redeemable_points: number
  locked_points: number
  current_rank: string
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
      return
    }
    loadUserData()
  }, [isConnected, router, address])

  const loadUserData = async () => {
    if (!address) return
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single()
      if (data) setUser(data)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Your Points</h2>
            <p className="text-2xl font-bold text-blue-600">{user?.redeemable_points.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Redeemable Points</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Your Rank</h2>
            <p className="text-2xl font-bold text-green-600">{user?.current_rank}</p>
            <p className="text-sm text-gray-500">Current Level</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Referral Code</h2>
            <p className="text-xl font-mono bg-gray-100 p-2 rounded">{user?.referral_code}</p>
            <p className="text-sm text-gray-500">Share this to earn points</p>
          </div>
        </div>
        <MinerShop />
      </div>
    </div>
  )
}