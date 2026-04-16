import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-lg">
        <Image src="/sit.png" alt="SIT Technologies" width={100} height={100} className="rounded-xl" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">SIT Technologies LMS</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to your learning portal. Sign in to access your courses and continue your journey.
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-up">Register</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
