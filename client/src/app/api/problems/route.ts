import { NextResponse } from "next/server"

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
    // ... more mock data
]

export async function GET() {
    return NextResponse.json(problems)
}
