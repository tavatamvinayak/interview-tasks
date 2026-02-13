'use server'

import { ServerClient } from '@/lib/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginWithGoogle() {
    const supabase = await ServerClient()
    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL!

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
            // Optional: request refresh token for Google API access
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error(error)
        // You can throw or return error
        redirect('/login?error=google_signin_failed')
    }

    if (data.url) {
        redirect(data.url) // This redirects to Google's consent screen
    }
}


import { revalidatePath } from 'next/cache'

export async function logout() {
  const supabase = await ServerClient()

  // Optional: check if there's actually a user (defensive)
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      // You could throw new Error(...) or just continue
    }
  }

  // Clear any cached data & force layout re-render
  revalidatePath('/', 'layout')

  // Redirect to home or login page
  redirect('/login')   // ← or '/' if you prefer
}