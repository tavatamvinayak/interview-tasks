import { ServerClient } from '@/lib/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = await ServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')

  return NextResponse.redirect(new URL('/login', request.url), 302)
}