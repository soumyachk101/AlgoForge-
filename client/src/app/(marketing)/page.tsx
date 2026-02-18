import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-14rem)]">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Master the Code. <br className="hidden sm:inline" />
            <span className="text-primary">Conquer the Interview.</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            The premium platform for competitive programming and technical interview preparation.
            800+ curated problems, real-time execution, and AI-powered learning.
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg" className="h-11 px-8">
                Start Coding Now
              </Button>
            </Link>
            <Link href="/problems">
              <Button variant="outline" size="lg" className="h-11 px-8">
                Explore Problems
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to ace your next technical interview.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">800+ Problems</h3>
                <p className="text-sm text-muted-foreground">
                  Curated algorithmic challenges from Easy to Hard, tagged by company and topic.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">In-Browser IDE</h3>
                <p className="text-sm text-muted-foreground">
                  Powerful Monaco editor with support for 10+ languages and real-time execution.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Get intelligent hints, code reviews, and complexity analysis as you code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
