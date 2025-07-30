import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import SupabaseProvider from '@/components/SupabaseProvider'
import Navbar from '@/components/Navbar/Navbar'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitácora Personal',
  description: 'Seguimiento diario de progreso con Supabase y Next.js'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 🔐 Obtener la sesión desde SSR (gracias al middleware)
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return (
    <html lang='es'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}>
        <SupabaseProvider initialSession={session}>
          <header className='bg-white shadow sticky top-0 z-10'>
            <Navbar />
          </header>
          <main className='max-w-4xl mx-auto p-4'>{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  )
}
