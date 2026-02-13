"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import BookmarkItem from "./BookmarkItem";
import { useApp } from "@/contexts/AppContext";

export default function BookmarkList({ userId }: any) {
    const supabase = createClient()
    const { bookmarks, setBookmarks } = useApp()

    const load = async () => {
        const { data }: any = await supabase
            .from("bookmarks")
            .select("*")
            .order("created_at", { ascending: false });
        setBookmarks(data || []);
    };

    useEffect(() => {
        load();
        const channel = supabase
            .channel("bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                load
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return bookmarks.map((b: any) => (
        <div key={b.id}>

            <BookmarkItem id={b.id}
                title={b.title}
                url={b.url}
                userId={userId}
                />
        </div>

    ));


}
