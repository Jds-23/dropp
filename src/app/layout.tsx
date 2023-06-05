"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/component/header'
import AppProvider from '@/state/app/context'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
    <AppProvider>
      <Header/>

        {children}
        </AppProvider>
        </body>
    </html>
  )
}
