"use client"
import { useState } from "react"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Underline,
    Strikethrough,
    Code,
    Link as LinkIcon,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Eye,
    EyeOff,
    Image,
    ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "./image-upload"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Enter description..." }: RichTextEditorProps) {
    const [isFocused, setIsFocused] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const [openUploader, setOpenUploader] = useState(false)

    const applyFormat = (format: string) => {
        const textarea = document.querySelector("textarea[data-rich-editor]") as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = value.substring(start, end)
        let newText = value
        let cursorOffset = 2

        switch (format) {
            case "bold":
                newText = value.substring(0, start) + `**${selectedText || "bold text"}**` + value.substring(end)
                cursorOffset = 2
                break
            case "italic":
                newText = value.substring(0, start) + `*${selectedText || "italic text"}*` + value.substring(end)
                cursorOffset = 1
                break
            case "underline":
                newText = value.substring(0, start) + `__${selectedText || "underlined text"}__` + value.substring(end)
                cursorOffset = 2
                break
            case "strikethrough":
                newText = value.substring(0, start) + `~~${selectedText || "strikethrough"}~~` + value.substring(end)
                cursorOffset = 2
                break
            case "code":
                newText = value.substring(0, start) + `\`${selectedText || "code"}\`` + value.substring(end)
                cursorOffset = 1
                break
            case "link":
                const url = prompt("Enter URL:")
                if (url) {
                    newText = value.substring(0, start) + `[${selectedText || "link text"}](${url})` + value.substring(end)
                    cursorOffset = 1
                }
                break
            case "h1":
                newText = value.substring(0, start) + `\n# ${selectedText || "Heading 1"}\n` + value.substring(end)
                cursorOffset = 2
                break
            case "h2":
                newText = value.substring(0, start) + `\n## ${selectedText || "Heading 2"}\n` + value.substring(end)
                cursorOffset = 3
                break
            case "h3":
                newText = value.substring(0, start) + `\n### ${selectedText || "Heading 3"}\n` + value.substring(end)
                cursorOffset = 4
                break
            case "ul":
                newText = value.substring(0, start) + `\n- ${selectedText || "list item"}\n` + value.substring(end)
                cursorOffset = 2
                break
            case "ol":
                newText = value.substring(0, start) + `\n1. ${selectedText || "list item"}\n` + value.substring(end)
                cursorOffset = 3
                break
            case "quote":
                newText = value.substring(0, start) + `\n> ${selectedText || "quote"}\n` + value.substring(end)
                cursorOffset = 2
                break
            case "image":
                setOpenUploader(true)
                break
        }

        onChange(newText)
        setTimeout(() => {
            textarea.focus()
            const newPos = selectedText ? start + cursorOffset : start + cursorOffset + (selectedText || "text").length
            textarea.setSelectionRange(newPos, newPos)
        }, 0)
    }

    const renderPreview = (text: string) => {
        return text
            // Headings
            .replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
            .replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
            .replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
            // Bold
            .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold'>$1</strong>")
            // Italic
            .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
            // Underline
            .replace(/__(.*?)__/g, "<u class='underline'>$1</u>")
            // Strikethrough
            .replace(/~~(.*?)~~/g, "<s class='line-through'>$1</s>")
            // Inline code
            .replace(/`(.*?)`/g, "<code class='bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>")
            // Images
            .replace(/!\[(.*?)\]\((.*?)\)/g,
                "<img src='$2' alt='$1' class='rounded-lg my-2 max-w-full' />"
            )
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary underline hover:text-primary/80' target='_blank' rel='noopener noreferrer'>$1</a>")
            // Blockquote
            .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-2'>$1</blockquote>")
            // Lists
            .replace(/\n- /g, "<br />• ")
            .replace(/\n\d+\. /g, "<br />1. ")
            // Line breaks
            .replace(/\n/g, "<br />")

    }

    const insertImage = (url: string, alt = "image") => {
        const textarea = document.querySelector("textarea[data-rich-editor]") as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        const markdown = `![${alt}](${url})`
        const newText = value.substring(0, start) + markdown + value.substring(end)

        onChange(newText)
    }

    return (
        <div className="space-y-2">
            <div className="border rounded-lg overflow-hidden bg-card">
                {openUploader && (
                    <ImageUpload
                        existingImages={[]}
                        onImagesAdd={(urls) => {
                            insertImage(urls[0])
                            setOpenUploader(false)
                        }}
                        onRemoveImage={() => setOpenUploader(false)}
                    />
                )}
                {/* Toolbar */}
                <div className="bg-muted/50 p-2 flex flex-wrap gap-1 border-b">
                    {/* Headings */}
                    <div className="flex gap-1 border-r border-border pr-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("h1")}
                            title="Heading 1"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Heading1 className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("h2")}
                            title="Heading 2"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Heading2 className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("h3")}
                            title="Heading 3"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Heading3 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Text formatting */}
                    <div className="flex gap-1 border-r border-border pr-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("bold")}
                            title="Bold"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Bold className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("italic")}
                            title="Italic"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Italic className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("underline")}
                            title="Underline"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Underline className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("strikethrough")}
                            title="Strikethrough"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Lists and blocks */}
                    <div className="flex gap-1 border-r border-border pr-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("ul")}
                            title="Bullet List"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("ol")}
                            title="Numbered List"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <ListOrdered className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("quote")}
                            title="Blockquote"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Quote className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Code and Links */}
                    <div className="flex gap-1 border-r border-border pr-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("code")}
                            title="Inline Code"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <Code className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => applyFormat("link")}
                            title="Insert Link"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setOpenUploader(true)}
                            title="Insert Link"
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                            <ImageIcon className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Preview Toggle */}
                    <div className="flex gap-1 ml-auto">
                        <Button
                            type="button"
                            size="sm"
                            variant={showPreview ? "default" : "ghost"}
                            onClick={() => setShowPreview(!showPreview)}
                            title={showPreview ? "Hide Preview" : "Show Preview"}
                            className="h-8 px-3 text-xs"
                        >
                            {showPreview ? (
                                <>
                                    <Eye className="w-4 h-4 mr-1" />
                                    Preview
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4 mr-1" />
                                    Preview
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-2 p-2`}>
                    <textarea
                        data-rich-editor
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="min-h-60 p-3 border rounded resize-y font-mono text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {showPreview && (
                        <div className="min-h-60 p-3 border rounded bg-muted/30 overflow-y-auto text-sm prose prose-sm max-w-none">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderPreview(value) || `<span class="text-muted-foreground">${placeholder}</span>`,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Help Text */}
            <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Formatting Guide:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div><code className="bg-muted px-1 rounded"># Heading</code> - Large heading</div>
                    <div><code className="bg-muted px-1 rounded">**bold**</code> - Bold text</div>
                    <div><code className="bg-muted px-1 rounded">*italic*</code> - Italic text</div>
                    <div><code className="bg-muted px-1 rounded">__underline__</code> - Underlined text</div>
                    <div><code className="bg-muted px-1 rounded">~~strike~~</code> - Strikethrough</div>
                    <div><code className="bg-muted px-1 rounded">`code`</code> - Inline code</div>
                    <div><code className="bg-muted px-1 rounded">[text](url)</code> - Link</div>
                    <div><code className="bg-muted px-1 rounded">&gt; quote</code> - Blockquote</div>
                </div>
            </div>
        </div>
    )
}
