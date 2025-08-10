"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold">
          CordKit Studio
        </Link>
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const signOutElement = document.getElementById("signout-handler");
              if (signOutElement) {
                signOutElement.click();
              }
            }}
          >
            Admin Panel
          </Button>
        </div>
      </div>
    </nav>
  );
}
