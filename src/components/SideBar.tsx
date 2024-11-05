"use client";

import Link from "next/link";
import { cn } from "@/lib/utils"; 

export function Sidebar() {




  return (
    <div
      className={cn(
        "flex flex-col min-h-screen p-4 transition-all duration-300 w-64",
        "bg-slate-300 text-sidebar-foreground"
      )}
    >
      {/* Логотип */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Logo</h1>
        


      </div>

      {/* Навігаційні посилання */}
      <nav className="flex flex-col gap-4">
        <Link href="/users" className="hover:bg-sidebar-accent p-2 rounded">
          Users
        </Link>
        <Link href="/albums" className="hover:bg-sidebar-accent p-2 rounded">
          Albums
        </Link>
        <Link href="/audio" className="hover:bg-sidebar-accent p-2 rounded">
          Audio
        </Link>
      </nav>
    </div>
  );
}
