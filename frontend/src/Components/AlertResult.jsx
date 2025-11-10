"use client";
import { useEffect } from "react";
import { HiX } from "react-icons/hi";

export default function AlertResult({ data, onClose }) {
  useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => onClose?.(), 5000);
    return () => clearTimeout(t);
  }, [data, onClose]);

  if (!data) return null;

  const green = "bg-emerald-50 text-emerald-800 border-emerald-200";
  const red  = "bg-rose-50 text-rose-800 border-rose-200";

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
        data.success ? green : red
      } animate-fade-in-down`}>
      <span className="text-sm font-medium">{data.message}</span>
      <button
        onClick={() => onClose?.()}
        className={`text-lg ${data.success ? "text-emerald-600" : "text-rose-600"}`}>
        <HiX />
      </button>
    </div>
  );
}