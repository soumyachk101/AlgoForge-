import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Terminal, Code2, Cpu } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-background">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 drop-shadow-sm">
              Master the Code. <br className="hidden sm:inline" />
              <span className="text-primary drop-shadow-md">Conquer the Interview.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
              The premium platform for competitive programming and technical interview preparation.
              800+ curated problems, real-time execution, and AI-powered learning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 rounded-2xl text-lg bg-primary text-primary-foreground shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0e0e10,-6px_-6px_12px_#26282c] hover:shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff] dark:hover:shadow-[inset_6px_6px_12px_#0e0e10,inset_-6px_-6px_12px_#26282c] active:scale-[0.98] transition-all duration-300">
                Start Coding Now
              </Button>
            </Link>
            <Link href="/problems">
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-lg border-none bg-clay dark:bg-zinc-900 shadow-skeuo hover:shadow-skeuo-inset active:scale-[0.98] transition-all duration-300">
                Explore Problems
              </Button>
            </Link>
          </div>

          {/* Stats / Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 text-center text-muted-foreground/80">
            <div>
              <h4 className="text-3xl font-bold text-foreground">800+</h4>
              <p className="text-sm">Curated Problems</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-foreground">10+</h4>
              <p className="text-sm">Languages Supported</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-foreground">24/7</h4>
              <p className="text-sm">AI Assistance</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-foreground">50k+</h4>
              <p className="text-sm">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Everything you need
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A complete environment to help you ace your next technical interview.
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {/* Feature 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-clay dark:bg-zinc-900 p-8 shadow-skeuo transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 shadow-skeuo-inset">
              <Code2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl">800+ Problems</h3>
              <p className="text-muted-foreground">
                Curated algorithmic challenges from Easy to Hard, tagged by company and topic.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-clay dark:bg-zinc-900 p-8 shadow-skeuo transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 shadow-skeuo-inset">
              <Terminal className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl">In-Browser IDE</h3>
              <p className="text-muted-foreground">
                Powerful Monaco editor with support for 10+ languages and real-time execution.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-clay dark:bg-zinc-900 p-8 shadow-skeuo transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 shadow-skeuo-inset">
              <Cpu className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl">AI Assistant</h3>
              <p className="text-muted-foreground">
                Get intelligent hints, code reviews, and complexity analysis as you code.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
