'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { supabase } from '../lib/supabase'
import PaymentModal from './PaymentModal'

interface Miner {
  id: number
  name: string
  price_usd: number
  points_per_day: number
}

export default function MinerShop() {
  const { address } = useAccount()
  const [miners, setMiners] = useState<Miner[]>([])
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const loadMiners = async () => {
    const { data, error } = await supabase.from('miners').select('*').order('price_usd')
    if (data) setMiners(data)
  }

  const handleBuyMiner = (miner: Miner) => {
    setSelectedMiner(miner)
    setShowPaymentModal(true)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Miner Shop</h2>
      <button onClick={loadMiners} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Load Available Miners
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {miners.map((miner) => (
          <div key={miner.id} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">{miner.name}</h3>
            <p className="text-gray-600">Price: ${miner.price_usd}</p>
            <p className="text-green-600">{miner.points_per_day.toLocaleString()} points/day</p>
            <button onClick={() => handleBuyMiner(miner)} className="bg-green-500 hover:bg-green-600 text-white mt-2 px-4 py-2 rounded w-full">
              Buy Now
            </button>
          </div>
        ))}
      </div>
      {showPaymentModal && selectedMiner && (
        <PaymentModal miner={selectedMiner} onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  )
}