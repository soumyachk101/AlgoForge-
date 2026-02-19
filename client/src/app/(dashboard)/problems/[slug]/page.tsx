"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Editor from "@monaco-editor/react"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Play, Send, RotateCcw, Box } from "lucide-react"

// Mock problem data (in real app, fetch from API)
const problems = {
    "two-sum": {
        title: "Two Sum",
        difficulty: "Easy",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
        starterCode: `function twoSum(nums, target) {
    // Write your code here
};`
    },
    "add-two-numbers": {
        title: "Add Two Numbers",
        difficulty: "Medium",
        description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
        starterCode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    
};`
    }
}

export default function WorkspacePage() {
    const params = useParams()
    const slug = params.slug as string
    const [code, setCode] = useState("")
    const [output, setOutput] = useState("Run your code to see output here...")

    // Load problem data
    const problem = problems[slug as keyof typeof problems] || {
        title: "Problem Not Found",
        difficulty: "Unknown",
        description: "Problem not found.",
        starterCode: "// Problem not found"
    }

    useEffect(() => {
        setCode(problem.starterCode)
    }, [problem])

    const handleRun = () => {
        setOutput("Running...\n\n> Test Case 1: Passed\n> Test Case 2: Passed\n\nResult: Accepted (Mock)")
    }

    const handleSubmit = () => {
        setOutput("Submitting...\n\n> All Test Cases Passed!\n> Runtime: 56ms\n> Memory: 42.1MB\n\nStatus: Accepted")
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col gap-4">
            {/* Header / Actions */}
            <div className="flex items-center justify-between bg-clay dark:bg-zinc-900 p-4 rounded-xl shadow-skeuo">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">{problem.title}</h1>
                    <span className={`text-xs px-2 py-1 rounded-md shadow-skeuo-inset ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600' : problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                        {problem.difficulty}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setCode(problem.starterCode)}
                        variant="ghost"
                        size="icon"
                        className="rounded-lg hover:bg-background/50 hover:shadow-skeuo-inset"
                        title="Reset Code"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={handleRun}
                        variant="secondary"
                        className="rounded-xl shadow-skeuo hover:shadow-skeuo-inset active:scale-[0.98]"
                    >
                        <Play className="mr-2 h-4 w-4" /> Run
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="rounded-xl bg-primary text-primary-foreground shadow-skeuo hover:shadow-skeuo-inset active:scale-[0.98]"
                    >
                        <Send className="mr-2 h-4 w-4" /> Submit
                    </Button>
                </div>
            </div>

            {/* Workspace Panels */}
            <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-xl border md:min-w-[450px]">
                {/* Description Panel */}
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="h-full bg-clay dark:bg-zinc-900 p-6 overflow-y-auto shadow-skeuo">
                        <div className="prose dark:prose-invert max-w-none">
                            {/* Render description as simple text/markdown for now */}
                            <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {problem.description}
                            </div>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle className="bg-border/50 hover:bg-primary transition-colors w-2" />

                {/* Editor & Console Panel */}
                <ResizablePanel defaultSize={60}>
                    <ResizablePanelGroup direction="vertical">
                        {/* Code Editor */}
                        <ResizablePanel defaultSize={70} minSize={30}>
                            <div className="h-full bg-[#1e1e1e] shadow-skeuo-inset overflow-hidden rounded-tr-xl">
                                <Editor
                                    height="100%"
                                    defaultLanguage="javascript"
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(value) => setCode(value || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        padding: { top: 16 },
                                        scrollBeyondLastLine: false,
                                        roundedSelection: true,
                                        automaticLayout: true,
                                    }}
                                />
                            </div>
                        </ResizablePanel>

                        <ResizableHandle className="bg-border/50 hover:bg-primary transition-colors h-2" />

                        {/* Console */}
                        <ResizablePanel defaultSize={30} minSize={10}>
                            <div className="h-full bg-black/90 p-4 font-mono text-sm text-green-400 overflow-y-auto shadow-skeuo-inset rounded-br-xl">
                                <div className="flex items-center gap-2 mb-2 text-muted-foreground border-b pb-2 border-white/10">
                                    <Box className="h-4 w-4" />
                                    <span>Console Output</span>
                                </div>
                                <pre className="whitespace-pre-wrap">{output}</pre>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
