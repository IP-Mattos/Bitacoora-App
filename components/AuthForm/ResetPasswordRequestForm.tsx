'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function ResetPasswordRequestForm() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/auth/reset-password'
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Te enviamos un correo para restablecer tu contraseña.')
    }
  }

  return (
    <form onSubmit={handleReset} className='space-y-4 border p-4 rounded mt-4'>
      <h2 className='text-xl font-semibold'>Recuperar contraseña</h2>

      <input
        type='email'
        placeholder='Tu email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='border p-2 rounded w-full'
        required
      />

      <button type='submit' className='bg-purple-600 text-white px-4 py-2 rounded'>
        Enviar correo de recuperación
      </button>

      {message && <p>{message}</p>}
    </form>
  )
}
