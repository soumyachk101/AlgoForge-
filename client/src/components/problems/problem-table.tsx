"use client"

import Link from "next/link"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const problems = [
    {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        status: "solved",
        acceptance: "48.2%",
        tags: ["Array", "Hash Table"],
    },
    {
        id: "add-two-numbers",
        title: "Add Two Numbers",
        difficulty: "Medium",
        status: "attempted",
        acceptance: "39.1%",
        tags: ["Linked List", "Math"],
    },
    {
        id: "longest-substring-without-repeating-characters",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        status: "unseen",
        acceptance: "32.8%",
        tags: ["Hash Table", "String", "Sliding Window"],
    },
    {
        id: "median-of-two-sorted-arrays",
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        status: "unseen",
        acceptance: "35.6%",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
    },
    {
        id: "longest-palindromic-substring",
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        status: "unseen",
        acceptance: "31.7%",
        tags: ["String", "Dynamic Programming"],
    },
    {
        id: "zigzag-conversion",
        title: "Zigzag Conversion",
        difficulty: "Medium",
        status: "unseen",
        acceptance: "40.3%",
        tags: ["String"],
    },
    {
        id: "reverse-integer",
        title: "Reverse Integer",
        difficulty: "Medium",
        status: "solved",
        acceptance: "27.3%",
        tags: ["Math"],
    },
    {
        id: "string-to-integer-atoi",
        title: "String to Integer (atoi)",
        difficulty: "Medium",
        status: "unseen",
        acceptance: "16.7%",
        tags: ["String"],
    },
    {
        id: "palindrome-number",
        title: "Palindrome Number",
        difficulty: "Easy",
        status: "solved",
        acceptance: "52.5%",
        tags: ["Math"],
    },
    {
        id: "regular-expression-matching",
        title: "Regular Expression Matching",
        difficulty: "Hard",
        status: "unseen",
        acceptance: "28.0%",
        tags: ["String", "Dynamic Programming", "Recursion"],
    },
]

export function ProblemTable() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
                <Card
                    key={problem.id}
                    className="group relative flex flex-col justify-between p-6 transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <Badge
                                variant={
                                    problem.difficulty === "Easy"
                                        ? "secondary"
                                        : problem.difficulty === "Medium"
                                            ? "default"
                                            : "destructive"
                                }
                                className={
                                    problem.difficulty === "Easy"
                                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-skeuo-inset"
                                        : problem.difficulty === "Medium"
                                            ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-skeuo-inset"
                                            : "bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-skeuo-inset"
                                }
                            >
                                {problem.difficulty}
                            </Badge>
                            {problem.status === "solved" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 drop-shadow-sm" />
                            ) : problem.status === "attempted" ? (
                                <Circle className="h-5 w-5 text-amber-500 fill-amber-500 drop-shadow-sm" />
                            ) : (
                                <div className="h-5 w-5 rounded-full bg-muted/50 shadow-skeuo-inset" />
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {problem.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Acceptance: {problem.acceptance}
                            </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {problem.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-background/50 text-muted-foreground shadow-skeuo-inset">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link href={`/problems/${problem.id}`} className="w-full">
                            <Button variant="skeuo" className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground">
                                Solve Problem
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            ))}
        </div>
    )
}
