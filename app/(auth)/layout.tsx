"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/sonner"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center p-12">
          <Image src="/sit.png" alt="SIT Technologies" width={80} height={80} className="rounded-xl mb-6" />
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">SIT Technologies</h1>
          <p className="text-primary-foreground/70 text-base">Learning Management System</p>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center p-8 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="mx-auto w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
