"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Map, Calendar, Plus, ArrowRight, TrendingUp, Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Tour {
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
    const [tours, setTours] = useState<Tour[]>([])
    const [tripRequests, setTripRequests] = useState<TripRequest[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            const [toursRes, requestsRes, messagesRes] = await Promise.all([
                fetch("/api/admin/tours", { credentials: "include" }),
                fetch("/api/admin/bookings", { credentials: "include" }),
                fetch("/api/admin/messages", { credentials: "include" }),
            ])

            if (toursRes.ok) {
                const data = await toursRes.json()
                setTours(data.tours || [])
            }

            if (requestsRes.ok) {
                const data = await requestsRes.json()
                setTripRequests(data.tripRequests || [])
            }

            if (messagesRes.ok) {
                const data = await messagesRes.json()
                setMessages(data.messages || [])
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100/50">
                            Overview
                        </span>
                        <p className="text-[13px] text-slate-500 font-medium">Welcome back to Timola Adventures</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Map className="h-7 w-7 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{tours.length}</p>
                        <p className="text-sm font-medium text-slate-500">Total Tours</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <Link href="/dashboard/tours" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center text-sm">
                            View all tours <ArrowRight className="ml-1 h-3 w-3" />
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
                        <p className="text-sm font-medium text-slate-500">Total Bookings</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <Link href="/dashboard/bookings" className="text-amber-600 font-semibold hover:text-amber-700 inline-flex items-center text-sm">
                            View all bookings <ArrowRight className="ml-1 h-3 w-3" />
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

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail className="h-7 w-7 text-indigo-600" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Messages</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{messages.length}</p>
                        <p className="text-sm font-medium text-slate-500">Inquiries</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                        <Link href="/dashboard/messages" className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center text-sm">
                            View all messages <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/dashboard/tours/new"
                        className="flex items-center p-6 border border-border rounded-xl bg-card hover:border-primary/50 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Plus className="h-6 w-6 text-primary group-hover:text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Add New Tour</h3>
                            <p className="text-sm text-muted-foreground">Create a new tour package from scratch</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/bookings"
                        className="flex items-center p-6 border border-border rounded-xl bg-card hover:border-secondary/50 hover:shadow-md transition-all group"
                    >
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                            <Calendar className="h-6 w-6 text-secondary group-hover:text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors">Manage Bookings</h3>
                            <p className="text-sm text-muted-foreground">View and respond to customer inquiries</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Trip Requests */}
            {tripRequests.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-slate-900">Recent Bookings</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Latest customer inquiries</p>
                        </div>
                        <Link href="/dashboard/bookings" className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
                            View all
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {tripRequests.slice(0, 5).map((request) => (
                            <Link
                                key={request.id}
                                href="/dashboard/bookings"
                                className="group flex items-center justify-between p-4 bg-slate-50/30 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-900 font-bold text-sm shadow-sm">
                                        {request.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{request.fullName}</p>
                                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                                            {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${request.status === "new" ? "bg-red-50 text-red-600 border-red-100" :
                                            request.status === "contacted" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                request.status === "confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    "bg-slate-50 text-slate-600 border-slate-100"
                                        }`}>
                                        {request.status}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {tours.length === 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Map className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Your Dashboard!</h3>
                            <p className="text-muted-foreground mb-4">
                                Start by adding your first tour to showcase your Morocco tours.
                            </p>
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Link href="/dashboard/tours/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Tour
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

