"use client";

import { useApp } from "@/contexts/AppContext";
import { createClient } from "@/lib/client";

type BookmarkItemProps = {
    id: string;
    title: string;
    url: string;
    userId:string;
};

export default function BookmarkItem({
    id,
    title,
    url,
    userId
}: BookmarkItemProps) {
    const {LoadItems} = useApp()
    const supabase = createClient()
    const deleteBookmark = async () => {
        const { error } = await supabase
            .from("bookmarks")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting bookmark:", error.message);
        }

        LoadItems({userId})
    };

    return (
        <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">

            {/* Left Section */}
            <div className="flex flex-col max-w-[80%]">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                >
                    {title}
                </a>
                <p className="text-sm text-gray-500 truncate mt-1">
                    {url}
                </p>
            </div>

            {/* Delete Button */}
            <button
                onClick={deleteBookmark}
                className="px-3 py-1.5 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
                Delete
            </button>

        </div>

    );
}
