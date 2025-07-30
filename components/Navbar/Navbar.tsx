'use client'

import Link from 'next/link'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error.message)
    } else {
      router.push('/login') // Redirige al login luego de cerrar sesión
    }
  }

  return (
    <nav className='max-w-4xl mx-auto px-4 py-3 flex justify-between items-center'>
      <Link href='/' className='text-lg font-bold'>
        📘 Bitácora
      </Link>
      <div className='space-x-4 text-sm'>
        {!session ? (
          <>
            <Link href='/login' className='hover:underline'>
              Iniciar sesión
            </Link>
            <Link href='/register' className='hover:underline'>
              Registrarse
            </Link>
          </>
        ) : (
          <>
            <Link href='/dashboard' className='hover:underline'>
              Dashboard
            </Link>
            <button onClick={handleLogout} className='text-red-600 hover:underline'>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
