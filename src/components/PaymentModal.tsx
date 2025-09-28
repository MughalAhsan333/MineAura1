'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { supabase } from '../lib/supabase'

interface Miner {
  id: number
  name: string
  price_usd: number
  points_per_day: number
}

interface PaymentModalProps {
  miner: Miner
  onClose: () => void
}

export default function PaymentModal({ miner, onClose }: PaymentModalProps) {
  const { address } = useAccount()
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const walletAddress = "0x3E69B19870534af98F52b6Db1f547801D3b5567c"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentProof || !address) return
    setIsSubmitting(true)
    try {
      const fileExt = paymentProof.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(fileName, paymentProof)
      if (uploadError) throw uploadError
      const { error: ticketError } = await supabase.from('purchase_tickets').insert([{
        user_id: address,
        miner_id: miner.id,
        payment_proof_image_url: fileName,
        status: 'pending'
      }])
      if (ticketError) throw ticketError
      alert('Payment proof submitted successfully! We will verify it soon.')
      onClose()
    } catch (error) {
      console.error('Error submitting payment:', error)
      alert('Error submitting payment proof. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Buy {miner.name}</h3>
        <div className="mb-4">
          <p className="font-semibold">Send exactly: ${miner.price_usd} USDT</p>
          <p className="text-sm text-gray-600 mb-2">To this address:</p>
          <div className="bg-gray-100 p-3 rounded break-all">{walletAddress}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Upload Payment Proof (Screenshot)</label>
            <input type="file" accept="image/*" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} className="w-full border rounded p-2" required />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50">
              {isSubmitting ? 'Submitting...' : 'Submit Proof'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}