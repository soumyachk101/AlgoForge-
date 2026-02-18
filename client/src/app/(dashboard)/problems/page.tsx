import { Metadata } from "next"

import { ProblemTable } from "@/components/problems/problem-table"

export const metadata: Metadata = {
    title: "Problems",
    description: "Browse all problems",
}

export default function ProblemsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
                <p className="text-muted-foreground">
                    Browse our curated list of algorithmic challenges.
                </p>
            </div>
            <ProblemTable />
        </div>
    )
}
