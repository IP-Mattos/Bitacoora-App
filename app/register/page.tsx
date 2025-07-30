'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'

import RegisterForm from '@/components/AuthForm/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace('/dashboard') // o la ruta principal del usuario
    }
  }, [session, router])

  return (
    <main className='p-4 max-w-md mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>Crear cuenta</h1>
      <RegisterForm />
      <p className='text-sm'>
        ¿Ya tenés cuenta?{' '}
        <Link href='/login' className='text-blue-600 underline'>
          Iniciá sesión
        </Link>
      </p>
    </main>
  )
}
