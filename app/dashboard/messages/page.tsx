"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Mail, Phone, Search, ArrowRight, Trash2, CheckCircle, Clock } from "lucide-react"

interface ContactMessage {
    id: string
    name: string
    email: string
    phone: string | null
    subject: string
    message: string
    status: string
    createdAt: string
}

const statusStyles = {
    unread: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
    read: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
    replied: "bg-green-50 text-green-700 border-green-200 ring-green-100",
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [updating, setUpdating] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const itemsPerPage = 10

    useEffect(() => {
        fetchMessages(1, true)
    }, [statusFilter])

    const fetchMessages = async (page: number, isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        else setLoadingMore(true)

        try {
            const url = statusFilter === "all"
                ? `/api/admin/messages?page=${page}&limit=${itemsPerPage}`
                : `/api/admin/messages?status=${statusFilter}&page=${page}&limit=${itemsPerPage}`

            const response = await fetch(url, { credentials: "include" })

            if (response.ok) {
                const data = await response.json()
                if (isInitial) {
                    setMessages(data.messages)
                } else {
                    setMessages(prev => [...prev, ...data.messages])
                }
                setHasMore(data.pagination.currentPage < data.pagination.pages)
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchMessages(nextPage)
        }
    }

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                setMessages(prev => prev.map(msg =>
                    msg.id === id ? { ...msg, status: newStatus } : msg
                ))
                if (selectedMessage?.id === id) {
                    setSelectedMessage({ ...selectedMessage, status: newStatus })
                }
            }
        } catch (error) {
            console.error("Failed to update status:", error)
        } finally {
            setUpdating(false)
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return

        try {
            const response = await fetch(`/api/admin/messages/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                setMessages(prev => prev.filter(msg => msg.id !== id))
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null)
                }
            }
        } catch (error) {
            console.error("Failed to delete message:", error)
        }
    }

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground italic animate-pulse">Loading messages...</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Messages</h1>
                        <div className="text-xs flex-shrink-0 font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {messages.length} inquiries
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Manage contact form inquiries</p>
                </div>

            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    {["all", "unread", "read", "replied"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all border ${statusFilter === status
                                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                : "bg-card text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-bold uppercase tracking-widest text-[10px] border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Sender</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Received</th>
                                {/* <th className="px-6 py-4 text-right">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic font-light">
                                        No messages found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <tr
                                        key={msg.id}
                                        className={`hover:bg-muted/30 transition-colors cursor-pointer group ${msg.status === 'unread' ? 'bg-orange-50/10' : ''}`}
                                        onClick={() => {
                                            setSelectedMessage(msg)
                                            if (msg.status === 'unread') updateStatus(msg.id, 'read')
                                        }}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border shadow-sm ${msg.status === 'unread' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'}`}>
                                                    {msg.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-bold transition-colors ${msg.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.name}</span>
                                                    <span className="text-xs text-muted-foreground/70 font-light">{msg.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`font-medium line-clamp-1 ${msg.status === 'unread' ? 'text-foreground' : 'text-muted-foreground/80'}`}>
                                                {msg.subject || "(No Subject)"}
                                            </span>
                                            <p className="text-xs text-muted-foreground/60 line-clamp-1 font-light mt-0.5">{msg.message}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border inline-flex items-center gap-1.5 ${statusStyles[msg.status as keyof typeof statusStyles] || statusStyles.unread}`}>
                                                <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-muted-foreground font-light text-xs">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </td>
                                        {/* <td className="px-6 py-5 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {hasMore && (
                    <div className="border-t border-border p-4 bg-muted/10 flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="text-muted-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            {loadingMore ? "Loading..." : "Load more messages"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-border flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="border-b border-border p-6 flex items-start justify-between bg-muted/10">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl border border-primary/20 shadow-inner">
                                    {selectedMessage.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-foreground">{selectedMessage.name}</h2>
                                    <div className="flex flex-col md:flex-row items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="font-medium text-primary/80">{selectedMessage.email}</span>
                                        <span className="opacity-30 hidden md:block">•</span>
                                        <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setSelectedMessage(null)} className="rounded-full h-10 w-10 hover:bg-muted hover:text-destructive transition-colors">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-1 p-8 space-y-8">
                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Subject</label>
                                <h3 className="text-xl font-bold text-foreground leading-tight">{selectedMessage.subject || "No Subject"}</h3>
                            </div>

                            {/* Trip Info Tags if available (simulated or just metadata) */}
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground border border-border">
                                    <Mail className="h-3.5 w-3.5" />
                                    {selectedMessage.email}
                                </div>
                                {selectedMessage.phone && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground border border-border">
                                        <Phone className="h-3.5 w-3.5" />
                                        {selectedMessage.phone}
                                    </div>
                                )}
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border shadow-sm ${statusStyles[selectedMessage.status as keyof typeof statusStyles]}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                                    {selectedMessage.status}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="space-y-3 pt-6 border-t border-border/50">
                                <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Message Body</label>
                                <div className="bg-muted/20 p-6 rounded-2xl border border-border/50 text-base leading-relaxed text-foreground whitespace-pre-wrap font-light italic">
                                    &quot;{selectedMessage.message}&quot;
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-border p-6 bg-muted/5 flex flex-wrap w-full items-center justify-between gap-4">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full text-xs font-bold uppercase tracking-widest h-10 px-5 border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all"
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {selectedMessage.status !== 'replied' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full text-xs font-bold uppercase tracking-widest h-10 px-5 transition-all"
                                        onClick={() => updateStatus(selectedMessage.id, 'replied')}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" /> Mark Replied
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    className="rounded-full text-xs font-bold uppercase tracking-widest h-10 px-8 shadow-lg shadow-primary/20 transition-all font-black"
                                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject || 'Inquiry regarding Timola Adventures'}`}
                                >
                                    <Mail className="h-4 w-4 mr-2" /> Reply via Email
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
