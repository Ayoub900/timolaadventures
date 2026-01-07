"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar, MapPin, Users, Mail, Phone, Search, ArrowRight } from "lucide-react"

interface TripRequest {
    id: string
    circuitName: string
    travelDates: string
    guests: number
    message: string
    fullName: string
    email: string
    phone: string
    status: string
    adminNotes: string
    createdAt: string
}

const statusStyles = {
    new: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
    contacted: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
    "in-progress": "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100",
    quoted: "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-100",
    confirmed: "bg-green-50 text-green-700 border-green-200 ring-green-100",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200 ring-gray-100",
}

// Assume this is within a React component function, e.g., `export default function TripRequestsPage() { ... }`
export default function TripRequestsPage() {
    const [requests, setRequests] = useState<TripRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(null)
    const [updating, setUpdating] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all") // "all", "new", "contacted", etc.
    const [pricePerPerson, setPricePerPerson] = useState(0)

    const itemsPerPage = 10 // Define itemsPerPage

    useEffect(() => {
        fetchRequests(1, true)
    }, [statusFilter]) // Refetch when status filter changes

    const fetchRequests = async (page: number, isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        else setLoadingMore(true)

        try {
            const url = statusFilter === "all"
                ? `/api/admin/trip-requests?page=${page}&limit=${itemsPerPage}`
                : `/api/admin/trip-requests?status=${statusFilter}&page=${page}&limit=${itemsPerPage}`

            const response = await fetch(url, { credentials: "include" })

            if (response.ok) {
                const data = await response.json()
                if (isInitial) {
                    setRequests(data.tripRequests)
                } else {
                    setRequests(prev => [...prev, ...data.tripRequests])
                }
                setHasMore(data.pagination.currentPage < data.pagination.pages)
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchRequests(nextPage)
        }
    }

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/trip-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                await fetchRequests(1, true)
                setCurrentPage(1)
                if (selectedRequest?.id === id) {
                    setSelectedRequest({ ...selectedRequest, status: newStatus })
                }
            }
        } catch (error) {
            console.error("Failed to update:", error)
        } finally {
            setUpdating(false)
        }
    }

    const filteredRequests = requests.filter(req =>
        req.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
                <p className="text-sm text-muted-foreground mt-1 text-primary">{requests.length} total bookings</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    {["all", "new", "contacted", "in-progress", "quoted", "confirmed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${statusFilter === status
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-card text-muted-foreground border border-input hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            {status === "all" ? "All" : status.replace("-", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Tour</th>
                                <th className="px-6 py-4">Travel Date</th>
                                <th className="px-6 py-4">Guests</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-3">
                                            <Calendar className="h-10 w-10 opacity-20" />
                                            <span>No bookings found.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr
                                        key={request.id}
                                        className="hover:bg-muted/30 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedRequest(request)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                                                    {request.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium group-hover:text-primary transition-colors">{request.fullName}</span>
                                                    <span className="text-xs text-muted-foreground">{request.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize inline-flex items-center gap-1.5 ${statusStyles[request.status as keyof typeof statusStyles] || statusStyles.new}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                                {request.status.replace("-", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {request.circuitName || <span className="text-muted-foreground italic">General Inquiry</span>}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {request.travelDates}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-4 w-4 opacity-50" />
                                                {request.guests}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination / Load More Footer */}
                {hasMore && (
                    <div className="border-t border-border p-3 bg-muted/10 flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="text-muted-foreground text-xs"
                        >
                            {loadingMore ? "Loading..." : "Load more bookings"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="border-b border-border p-6 flex items-start justify-between bg-muted/10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20 shadow-sm">
                                    {selectedRequest.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">{selectedRequest.fullName}</h2>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                        <span>Booked on {new Date(selectedRequest.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                        <span>•</span>
                                        <span className="font-mono text-xs opacity-70">ID: {selectedRequest.id.slice(-6)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" onClick={() => setSelectedRequest(null)} className="rounded-full h-8 w-8 hover:bg-muted">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="overflow-y-auto flex-1 p-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border h-full">

                                {/* Left Column: Status & Contact */}
                                <div className="p-6 space-y-8 bg-muted/5 md:col-span-1">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Booking Status</h3>
                                        <div className="space-y-2">
                                            {["new", "contacted", "in-progress", "quoted", "confirmed", "cancelled"].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => updateStatus(selectedRequest.id, status)}
                                                    disabled={updating}
                                                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-between ${selectedRequest.status === status
                                                        ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                                                        : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
                                                        }`}
                                                >
                                                    <span className="capitalize">{status.replace("-", " ")}</span>
                                                    {selectedRequest.status === status && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-background border border-border">
                                                <Mail className="h-4 w-4 text-primary" />
                                                <a href={`mailto:${selectedRequest.email}`} className="hover:underline hover:text-primary truncate font-medium">
                                                    {selectedRequest.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-background border border-border">
                                                <Phone className="h-4 w-4 text-primary" />
                                                <a href={`tel:${selectedRequest.phone}`} className="hover:underline hover:text-primary truncate font-medium">
                                                    {selectedRequest.phone}
                                                </a>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-2 mt-2"
                                                onClick={() => window.location.href = `mailto:${selectedRequest.email}?subject=Regarding Your Booking: ${selectedRequest.circuitName}`}
                                            >
                                                <Mail className="h-4 w-4" />
                                                Send Email
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Trip Details */}
                                <div className="p-6 md:p-8 space-y-8 md:col-span-2 bg-card">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tour</label>
                                            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                                                <MapPin className="h-5 w-5 text-primary" />
                                                <span className="font-semibold text-foreground text-lg">{selectedRequest.circuitName || "Custom Inquiry"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Travel Dates</label>
                                            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                                                <Calendar className="h-5 w-5 text-primary" />
                                                <span className="font-semibold text-foreground">{selectedRequest.travelDates}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Guests</label>
                                            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                                                <Users className="h-5 w-5 text-primary" />
                                                <span className="font-semibold text-foreground">{selectedRequest.guests} Person{selectedRequest.guests !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Price Estimate</label>
                                            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                                                <span className="text-muted-foreground text-sm italic">Not calculated automatically</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedRequest.message && (
                                        <div className="space-y-2 pt-4 border-t border-border">
                                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Customer Message</h3>
                                            <div className="bg-muted/30 p-4 rounded-xl border border-border text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                                {selectedRequest.message}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price Calculator */}
                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Price Calculator</h3>
                                        <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-muted-foreground">Price per Person</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            className="w-full pl-3 pr-8 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                            onChange={(e) => {
                                                                const val = parseFloat(e.target.value) || 0
                                                                // Store in a local state if needed, or just use DOM for simple calc
                                                                // Better to add state: see below
                                                                setPricePerPerson(val)
                                                            }}
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-medium text-muted-foreground">Total ({selectedRequest.guests} guests)</label>
                                                    <div className="w-full py-2 px-3 text-sm font-semibold bg-background border border-input rounded-md text-foreground">
                                                        {(pricePerPerson * selectedRequest.guests).toLocaleString('en-US', { style: 'currency', currency: 'EUR' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

