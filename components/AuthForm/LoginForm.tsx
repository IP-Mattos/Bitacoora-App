'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function LoginForm() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Sesión iniciada.')
    }
  }

  return (
    <form onSubmit={handleLogin} className='space-y-4 border p-4 rounded'>
      <h2 className='text-xl font-semibold'>Iniciar Sesión</h2>
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
      <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded'>
        Ingresar
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
