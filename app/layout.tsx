import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CallLabs - AI Calls For You',
  description: 'Cancel subscriptions, make reservations, handle customer service - without waiting on hold',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}