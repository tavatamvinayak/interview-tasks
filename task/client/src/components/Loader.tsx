"use client";

export default function Loader({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Optional Text */}
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}
