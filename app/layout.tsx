import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Android Studio Cloud',
  description: 'Web-based Android Studio IDE',
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
