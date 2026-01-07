"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Map, Calendar, Plus, ArrowRight, TrendingUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Circuit {
    id: string
    name: string
    category: string
}

interface TripRequest {
    id: string
    status: string
    fullName: string
    createdAt: string
}

export default function DashboardPage() {
    const [circuits, setCircuits] = useState<Circuit[]>([])
    const [tripRequests, setTripRequests] = useState<TripRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            const [circuitsRes, requestsRes] = await Promise.all([
                fetch("/api/admin/circuits", { credentials: "include" }),
                fetch("/api/admin/trip-requests", { credentials: "include" }),
            ])

            if (circuitsRes.ok) {
                const data = await circuitsRes.json()
                setCircuits(data.circuits || [])
            }

            if (requestsRes.ok) {
                const data = await requestsRes.json()
                setTripRequests(data.tripRequests || [])
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
        } finally {
            setLoading(false)
        }
    }

    const newRequests = Array.isArray(tripRequests) ? tripRequests.filter((r) => r.status === "new").length : 0
    const totalRequests = Array.isArray(tripRequests) ? tripRequests.length : 0

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Map className="h-7 w-7 text-blue-600" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Tours</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{circuits.length}</p>
                        <p className="text-sm font-medium text-slate-500">Total Circuits</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <Link href="/dashboard/circuits" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center text-sm">
                            View all circuits <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="h-7 w-7 text-amber-600" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Bookings</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{totalRequests}</p>
                        <p className="text-sm font-medium text-slate-500">Total Requests</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <Link href="/dashboard/trip-requests" className="text-amber-600 font-semibold hover:text-amber-700 inline-flex items-center text-sm">
                            View all requests <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${newRequests > 0 ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                            <TrendingUp className={`h-7 w-7 ${newRequests > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Status</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{newRequests}</p>
                        <p className="text-sm font-medium text-slate-500">New Inquiries</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <p className="text-sm font-medium">
                            {newRequests > 0 ? (
                                <span className="text-rose-600 flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>Requires attention</span>
                            ) : (
                                <span className="text-emerald-600 flex items-center"><Check className="w-3 h-3 mr-1" />All caught up!</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/dashboard/circuits/new"
                        className="flex items-center p-6 border border-border rounded-xl bg-card hover:border-primary/50 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Plus className="h-6 w-6 text-primary group-hover:text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Add New Circuit</h3>
                            <p className="text-sm text-muted-foreground">Create a new tour package from scratch</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/trip-requests"
                        className="flex items-center p-6 border border-border rounded-xl bg-card hover:border-secondary/50 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                            <Calendar className="h-6 w-6 text-secondary group-hover:text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors">Manage Requests</h3>
                            <p className="text-sm text-muted-foreground">View and respond to customer inquiries</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Trip Requests */}
            {tripRequests.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Recent Trip Requests</h2>
                        <Link href="/dashboard/trip-requests" className="text-sm text-primary hover:text-primary/80">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {tripRequests.slice(0, 5).map((request) => (
                            <Link
                                key={request.id}
                                href="/dashboard/trip-requests"
                                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${request.status === "new" ? "bg-destructive" :
                                        request.status === "contacted" ? "bg-secondary-foreground" :
                                            request.status === "confirmed" ? "bg-green-500" : "bg-muted-foreground"
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{request.fullName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs px-2 py-1 bg-muted text-foreground rounded capitalize">
                                    {request.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {circuits.length === 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Map className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Your Dashboard!</h3>
                            <p className="text-muted-foreground mb-4">
                                Start by adding your first circuit to showcase your Morocco tours.
                            </p>
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Link href="/dashboard/circuits/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Circuit
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

