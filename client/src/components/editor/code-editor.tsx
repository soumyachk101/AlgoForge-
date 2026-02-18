"use client"

import * as React from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"

interface CodeEditorProps {
    language?: string
    value?: string
    onChange?: (value: string | undefined) => void
}

export function CodeEditor({
    language = "javascript",
    value = "// Start coding here",
    onChange,
}: CodeEditorProps) {
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleEditorDidMount: OnMount = () => {
        // Editor mounted logic
    }

    if (!mounted) {
        return <div className="h-full w-full bg-muted/20 animate-pulse" />
    }

    const currentTheme = theme === "system" ? systemTheme : theme

    return (
        <div className="h-full w-full overflow-hidden rounded-md border">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={value}
                onChange={onChange}
                theme={currentTheme === "dark" ? "vs-dark" : "light"}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    )
}
