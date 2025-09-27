'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface PurchaseTicket {
  id: number
  status: string
  created_at: string
  payment_proof_image_url: string
  users: { wallet_address: string }
  miners: { name: string; price_usd: number }
}

export default function AdminPanel() {
  const [purchaseTickets, setPurchaseTickets] = useState<PurchaseTicket[]>([])
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = 'mineaura2024'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      loadPurchaseTickets()
    } else {
      alert('Wrong password!')
    }
  }

  const loadPurchaseTickets = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('purchase_tickets')
      .select('*, users:user_id (wallet_address), miners:miner_id (name, price_usd)')
      .order('created_at', { ascending: false })
    if (data) setPurchaseTickets(data)
    setLoading(false)
  }

  const handleApprove = async (ticketId: number) => {
    if (!confirm('Approve this purchase?')) return
    const { error } = await supabase
      .from('purchase_tickets')
      .update({ status: 'approved' })
      .eq('id', ticketId)
    if (!error) {
      alert('Approved!')
      loadPurchaseTickets()
    } else {
      alert('Error approving ticket')
    }
  }

  const handleReject = async (ticketId: number) => {
    if (!confirm('Reject this purchase?')) return
    const { error } = await supabase
      .from('purchase_tickets')
      .update({ status: 'rejected' })
      .eq('id', ticketId)
    if (!error) {
      alert('Rejected!')
      loadPurchaseTickets()
    } else {
      alert('Error rejecting ticket')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="border p-2 rounded w-full mb-4"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">Pending Purchase Tickets</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {purchaseTickets.filter(t => t.status === 'pending').map((ticket) => (
                <div key={ticket.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>User:</strong> {ticket.users.wallet_address}</p>
                      <p><strong>Miner:</strong> {ticket.miners.name} (${ticket.miners.price_usd})</p>
                      <p><strong>Submitted:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(ticket.id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                      <button onClick={() => handleReject(ticket.id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                    </div>
                  </div>
                  {ticket.payment_proof_image_url && (
                    <div className="mt-2">
                      <p className="font-semibold">Payment Proof:</p>
                      <img 
                        src={`https://ujbeatnyhhpqwtwybcqr.supabase.co/storage/v1/object/public/payment-proofs/${ticket.payment_proof_image_url}`}
                        alt="Payment proof" 
                        className="max-w-xs border rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
              {purchaseTickets.filter(t => t.status === 'pending').length === 0 && (
                <p className="text-gray-500">No pending tickets</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}