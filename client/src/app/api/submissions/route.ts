import { NextResponse } from "next/server"

export async function POST(request: Request) {
    await request.json()

    // Mock submission processing
    const isCorrect = Math.random() > 0.5

    return NextResponse.json({
        id: Math.random().toString(36).substring(7),
        status: isCorrect ? "Accepted" : "Wrong Answer",
        runtime: Math.floor(Math.random() * 100) + "ms",
        memory: Math.floor(Math.random() * 50) + "MB",
    })
}
