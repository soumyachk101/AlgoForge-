"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ListTodo,
    Trophy,
    User,
    Settings,
    LogOut,
    Terminal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Problems",
        href: "/problems",
        icon: ListTodo,
    },
    {
        title: "Contests",
        href: "/contests",
        icon: Trophy,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full flex-col border-r bg-clay dark:bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl text-primary drop-shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-skeuo">
                        <Terminal className="h-6 w-6" />
                    </div>
                    <span>AlgoArena</span>
                </Link>
            </div>
            <div className="flex-1 py-6">
                <nav className="grid items-start px-4 text-sm font-medium gap-3">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground shadow-skeuo"
                                    : "text-muted-foreground hover:bg-background/50 hover:text-primary hover:shadow-skeuo-inset"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <Button variant="outline" className="w-full gap-2 rounded-xl h-12 border-none bg-background shadow-skeuo hover:shadow-skeuo-inset hover:text-destructive active:scale-[0.98] transition-all">
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
