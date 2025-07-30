'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function RegisterForm() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Registro exitoso. Revisá tu correo.')
    }
  }

  return (
    <form onSubmit={handleRegister} className='space-y-4 border p-4 rounded'>
      <h2 className='text-xl font-semibold'>Registrarse</h2>

      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='border p-2 rounded w-full'
        required
      />

      <input
        type='password'
        placeholder='Contraseña'
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

      <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
        Registrarse
      </button>

      {message && <p>{message}</p>}
    </form>
  )
}
