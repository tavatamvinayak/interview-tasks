import AddBookmark from "@/components/bookmarks/AddBookmark"
import BookmarkList from "@/components/bookmarks/BookmarkList"
import Header from "@/components/Header"
import { ServerClient } from "@/lib/server"

export default async function Home() {
  const supabase = await ServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error("getUser error:", error)

  }

  return (
    <div className="min-h-screen">
      <Header user={user ?? null} />   {/* user or null */}

      <main className="container mx-auto py-10 px-4">
        {user ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">
                Welcome back, {user.email}
              </h1>
              <p>You are signed in.</p>
            </div>
            <div>
              <AddBookmark userId={user.id} />

              <BookmarkList userId={user.id} />

            </div>
          </>

        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Home Page</h1>
            <p>Please sign in to continue.</p>
          </div>
        )}
      </main>
    </div>
  )
}