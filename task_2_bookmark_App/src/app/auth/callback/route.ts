import { ServerClient } from '@/lib/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if we have error, usually redirect back with message
  if (searchParams.has('error')) {
    return NextResponse.redirect(
      `${origin}/login?error=${searchParams.get('error_description')}`
    )
  }

  if (code) {
    const supabase = await ServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // IMPORTANT: redirect to the exact page user came from (or home)
  const next = searchParams.get('next') ?? '/'

  return NextResponse.redirect(`${origin}${next}`)
}