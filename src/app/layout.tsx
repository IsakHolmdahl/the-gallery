import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Gallery',
  description: 'AI Image Experience - Curate your vision',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}