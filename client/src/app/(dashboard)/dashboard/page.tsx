import { Metadata } from "next"
import { Activity, CreditCard, DollarSign, Users, Trophy, Flame, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/dashboard/stats-card"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "User dashboard and overview.",
}

export default function DashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-8 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <Button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground shadow-skeuo hover:shadow-skeuo-inset active:scale-[0.98] transition-all">
                        Daily Challenge
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Solved"
                    value="128"
                    description="+12 from last week"
                    icon={Activity}
                />
                <StatsCard
                    title="Current Streak"
                    value="5 Days"
                    description="Keep it up!"
                    icon={Flame}
                />
                <StatsCard
                    title="Global Rank"
                    value="#1,234"
                    description="Top 15%"
                    icon={Trophy}
                />
                <StatsCard
                    title="Contest Rating"
                    value="1540"
                    description="+25 last contest"
                    icon={Target}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-2xl bg-clay dark:bg-zinc-900 p-6 shadow-skeuo">
                    <div className="flex flex-col space-y-1.5 mb-6">
                        <h3 className="font-semibold leading-none tracking-tight">Activity Heatmap</h3>
                        <p className="text-sm text-muted-foreground">Your submission history over the last year.</p>
                    </div>
                    <div className="h-[200px] w-full flex items-center justify-center bg-background/50 rounded-xl shadow-skeuo-inset text-muted-foreground">
                        {/* Placeholder for real heatmap */}
                        [Heatmap Visualization Placeholder]
                    </div>
                </div>

                <div className="col-span-3 rounded-2xl bg-clay dark:bg-zinc-900 p-6 shadow-skeuo">
                    <div className="flex flex-col space-y-1.5 mb-6">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">Recent problems you have solved.</p>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/50 shadow-skeuo-inset hover:shadow-skeuo transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Two Sum</p>
                                        <p className="text-xs text-muted-foreground">Easy • 10 mins ago</p>
                                    </div>
                                </div>
                                <div className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-lg">Solved</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
