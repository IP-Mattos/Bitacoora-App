'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function ResetPasswordPage() {
  const supabase = useSupabaseClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Tu contraseña ha sido cambiada con éxito.')
    }
  }

  return (
    <main className='p-4 max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Restablecer contraseña</h1>

      <form onSubmit={handleSubmit} className='space-y-4 border p-4 rounded'>
        <input
          type='password'
          placeholder='Nueva contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border p-2 rounded w-full'
          required
        />

        <input
          type='password'
          placeholder='Confirmar contraseña'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='border p-2 rounded w-full'
          required
        />

        <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded'>
          Cambiar contraseña
        </button>

        {message && <p>{message}</p>}
      </form>
    </main>
  )
}
