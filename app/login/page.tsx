'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'

import LoginForm from '@/components/AuthForm/LoginForm'
import ResetPasswordRequestForm from '@/components/AuthForm/ResetPasswordRequestForm'
import Link from 'next/link'

export default function LoginPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace('/dashboard') // o la ruta que definas como principal
    }
  }, [session, router])

  return (
    <main className='p-4 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Iniciar sesión</h1>
      <LoginForm />
      <ResetPasswordRequestForm />
      <p className='mt-4 text-sm'>
        ¿No tenés cuenta?{' '}
        <Link href='/register' className='text-blue-600 underline'>
          Registrate
        </Link>
      </p>
    </main>
  )
}
