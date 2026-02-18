"use client"

import Link from "next/link"
import { CheckCircle2, Circle } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Status</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Acceptance</TableHead>
                        <TableHead className="hidden md:table-cell">Tags</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem.id}>
                            <TableCell>
                                {problem.status === "solved" ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : problem.status === "attempted" ? (
                                    <Circle className="h-4 w-4 text-amber-500 fill-amber-500" />
                                ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                )}
                            </TableCell>
                            <TableCell className="font-medium">
                                <Link
                                    href={`/problems/${problem.id}`}
                                    className="hover:underline hover:text-primary"
                                >
                                    {problem.title}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        problem.difficulty === "Easy"
                                            ? "secondary" // Greenish in custom theme or handle manually
                                            : problem.difficulty === "Medium"
                                                ? "default" // Amber/Warning
                                                : "destructive" // Red
                                    }
                                    className={
                                        problem.difficulty === "Easy"
                                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
                                            : problem.difficulty === "Medium"
                                                ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
                                                : "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
                                    }
                                >
                                    {problem.difficulty}
                                </Badge>
                            </TableCell>
                            <TableCell>{problem.acceptance}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex gap-1 flex-wrap">
                                    {problem.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {problem.tags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{problem.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
