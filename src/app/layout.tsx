import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WagmiProvider from '../providers/WagmiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MineAura - Points Mining Platform',
  description: 'Earn points through referrals and miners.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Only render WagmiProvider on client side */}
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  )
}
