import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-lg">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>

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
