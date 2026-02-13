

## Getting Started
```bash
npm install

npm run dev
```

env file 

.env.local 

```
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```


Problems Faced & How I Solved Them

# Google OAuth Not Persisting Session After Login

####  Problem
After successful Google login, the user was redirected back to the app but appeared logged out on page refresh or server-rendered pages.

#### Why It Happened
Supabase client (supabase-js) does not automatically read cookies in Server Components

Using client-side auth logic inside App Router caused session mismatch

#### Solution

Introduced a Supabase Server Client using @supabase/auth-helpers-nextjs

Auth checks moved to server-side pages


#### Problem
Bookmarks added in one tab didn’t appear in another without refresh.

###### Why It Happened

No realtime subscription to database changes

Manual refetching not triggered


# Realtime Updates Not Syncing Across Tabs

###### Problem
Bookmarks added in one tab didn’t appear in another without refresh.

###### Why It Happened

No realtime subscription to database changes

Manual refetching not triggered

###### Solution
Used Supabase Realtime postgres_changes


# Delete Bookmark Worked but UI Didn’t Update Instantly

#### Problem
After deleting a bookmark, the UI didn’t update until refresh.

#### Why It Happened

No local state mutation

UI relied on stale data

#### Solution

Let Supabase Realtime handle updates

On delete → database emits change → subscription refetches data
