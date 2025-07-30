import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession() // esto recupera la sesión y refresca si es necesario

  return res
}

export const config = {
  matcher: [
    /*
      protegé todas las rutas de /dashboard para adelante,
      podés ajustar según lo que necesites
    */
    '/dashboard/:path*',
    '/profile/:path*',
    '/entries/:path*'
  ]
}
