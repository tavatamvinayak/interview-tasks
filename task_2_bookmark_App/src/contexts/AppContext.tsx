"use client"
import { createClient } from "@/lib/client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const supabase = createClient()
    const [bookmarks, setBookmarks] = useState([]);


    const load = async () => {
        const { data }: any = await supabase
            .from("bookmarks")
            .select("*")
            .order("created_at", { ascending: false });
        setBookmarks(data || []);
    };

    const LoadItems = ({userId}:any)=>{
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
    }

    return <AppContext.Provider value={{ bookmarks, setBookmarks ,LoadItems}}>{children}</AppContext.Provider>;
};
const useApp = () => useContext(AppContext)

export { AppContext, AppProvider, useApp }