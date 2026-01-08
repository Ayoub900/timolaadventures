"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash, Search } from "lucide-react"

interface Tour {
    id: string
    name: string
    slug: string
    duration: number
    price: number
    category: string
    featured: boolean
    active: boolean
}

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalTours, setTotalTours] = useState(0)
    const itemsPerPage = 10

    useEffect(() => {
        fetchTours()
    }, [currentPage, searchQuery]) // Refetch on page or search change

    const fetchTours = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/tours?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`, {
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                setTours(data.tours)
                setTotalPages(data.pagination.pages)
                setTotalTours(data.pagination.total)
            }
        } catch (error) {
            console.error("Failed to fetch tours:", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteTour = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tour?")) return

        try {
            const response = await fetch(`/api/admin/tours/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                fetchTours()
            }
        } catch (error) {
            console.error("Failed to delete:", error)
        }
    }

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50/30">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Tours</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100/50">
                            {totalTours} Total
                        </span>
                        <p className="text-[13px] text-slate-500 font-medium">Manage your Morocco tour circuits</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] px-6 py-4 rounded-full shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <Link href="/dashboard/tours/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Tour
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search tours..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1) // Reset to first page on search
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
            </div>

            {/* Tours Table */}
            {loading && tours.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            ) : tours.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <h3 className="text-lg font-medium text-foreground mb-2">No tours found</h3>
                    <p className="text-muted-foreground mb-4">Get started by creating your first tour</p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/dashboard/tours/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tour
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        Tour Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        Duration
                                    </th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tours.map((tour) => (
                                    <tr key={tour.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 font-black text-sm group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                                                    {tour.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tour.name}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{tour.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 rounded-full uppercase tracking-widest">
                                                {tour.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
                                            {tour.duration} Days
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                                            €{tour.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {tour.featured && (
                                                    <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 rounded-full uppercase tracking-widest">
                                                        Featured
                                                    </span>
                                                )}
                                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest border ${tour.active
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                                    }`}>
                                                    {tour.active ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/tours/${tour.id}/edit`}
                                                    className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 transition-all"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteTour(tour.id)}
                                                    className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-100 transition-all"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted/20">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, totalTours)}</span> of{" "}
                                        <span className="font-semibold text-foreground">{totalTours}</span> tours
                                    </p>
                                </div>
                                <div className="flex gap-1.5">
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 shadow-sm"
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                className={`h-8 w-8 p-0 shadow-sm ${currentPage === page ? 'bg-primary border-primary' : ''}`}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 shadow-sm"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
