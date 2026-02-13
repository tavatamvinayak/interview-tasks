'use server'

import { ServerClient } from '@/lib/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const getBaseUrl = () => {
    // Production override
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    // Vercel preview / branch deploy
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    // Local
    return 'http://localhost:3000';
};

export async function loginWithGoogle() {
    const supabase = await ServerClient()
    const baseUrl = getBaseUrl();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${baseUrl}/auth/callback`,
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
