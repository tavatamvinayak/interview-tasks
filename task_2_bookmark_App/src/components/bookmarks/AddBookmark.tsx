"use client";

import { useApp } from "@/contexts/AppContext";
import { createClient } from "@/lib/client";

export default function AddBookmark({ userId }: { userId: string }) {
  const supabase = createClient(); 
  const {LoadItems} = useApp()
  const add = async (e: any) => {
    e.preventDefault();
    const form = e.target;

    await supabase.from("bookmarks").insert({
      title: form.title.value,
      url: form.url.value,
      user_id: userId,
    });

    form.reset();
    LoadItems({userId})
  };

 return (
  <form
    onSubmit={add}
    className="flex gap-3 p-4 bg-white rounded-xl shadow-md border border-gray-100"
  >
    <input
      name="title"
      placeholder="Title"
      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <input
      name="url"
      placeholder="URL"
      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Add
    </button>
  </form>
);

}
