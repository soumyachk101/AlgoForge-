import { Metadata } from "next"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CodeEditor } from "@/components/editor/code-editor"
import ReactMarkdown from "react-markdown"

interface ProblemPageProps {
    params: {
        slug: string
    }
}

export const metadata: Metadata = {
    title: "Problem Detail",
    description: "Solve a coding problem",
}

// Mock data fetcher
const getProblem = (slug: string) => {
    return {
        id: slug,
        title: "Two Sum",
        difficulty: "Easy",
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:

\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`
    `,
        starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
    }
}

export default function ProblemPage({ params }: ProblemPageProps) {
    const problem = getProblem(params.slug)

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">{problem.title}</h1>
                    <Badge>{problem.difficulty}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Run</Button>
                    <Button size="sm">Submit</Button>
                </div>
            </div>
            <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="flex h-full flex-col p-4 overflow-y-auto">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList>
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="hints">Hints</TabsTrigger>
                                <TabsTrigger value="solution">Solution</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="mt-4 prose dark:prose-invert max-w-none">
                                <ReactMarkdown>{problem.description}</ReactMarkdown>
                            </TabsContent>
                            <TabsContent value="hints" className="mt-4">
                                <p className="text-muted-foreground">Hints are hidden for now.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={70}>
                            <CodeEditor value={problem.starterCode} />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={30}>
                            <div className="p-4 h-full bg-muted/20">
                                <h3 className="font-semibold mb-2">Test Results</h3>
                                <p className="text-sm text-muted-foreground">Run your code to see results.</p>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
