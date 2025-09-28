'use client'

import { useAccount } from 'wagmi'
import Link from 'next/link'

const ADMIN_WALLET = '0x3E69B19870534af98F52b6Db1f547801D3b5567c'

export default function AdminLink() {
  const { address } = useAccount()
  if (address?.toLowerCase() !== ADMIN_WALLET.toLowerCase()) return null

  return (
    <Link href="/admin" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
      Admin Panel
    </Link>
  )
}