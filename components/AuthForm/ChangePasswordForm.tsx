'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function ChangePasswordForm() {
  const supabase = useSupabaseClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Contraseña actualizada con éxito.')
    }
  }

  return (
    <form onSubmit={handleChangePassword} className='space-y-4 border p-4 rounded mt-4'>
      <h2 className='text-xl font-semibold'>Cambiar Contraseña</h2>

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
        placeholder='Confirmar nueva contraseña'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className='border p-2 rounded w-full'
        required
      />

      <button type='submit' className='bg-yellow-600 text-white px-4 py-2 rounded'>
        Cambiar contraseña
      </button>

      {message && <p>{message}</p>}
    </form>
  )
}
