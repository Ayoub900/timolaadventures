export function renderMarkdown(text: string): string {
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
