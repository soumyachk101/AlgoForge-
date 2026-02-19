import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"

interface StatsCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    className?: string
}

export function StatsCard({ title, value, description, icon: Icon, className }: StatsCardProps) {
    return (
        <Card className={cn("relative overflow-hidden p-6 transition-transform hover:-translate-y-1", className)}>
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-skeuo-inset">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="pt-4">
                <div className="text-3xl font-bold text-foreground drop-shadow-sm">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </div>
        </Card>
    )
}
