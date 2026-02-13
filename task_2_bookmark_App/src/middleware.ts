import { ServerClient } from '@/lib/server'
import { NextResponse } from 'next/server'

export async function middleware(request:any) {
  const supabase = await ServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}