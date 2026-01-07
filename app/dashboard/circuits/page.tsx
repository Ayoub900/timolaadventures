"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash, Search } from "lucide-react"

interface Circuit {
    id: string
    name: string
    slug: string
    duration: number
    price: number
    category: string
    featured: boolean
    active: boolean
}

export default function CircuitsPage() {
    const [circuits, setCircuits] = useState<Circuit[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCircuits, setTotalCircuits] = useState(0)
    const itemsPerPage = 8

    useEffect(() => {
        fetchCircuits()
    }, [currentPage])

    const fetchCircuits = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/circuits?page=${currentPage}&limit=${itemsPerPage}`, {
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                setCircuits(data.circuits)
                setTotalPages(data.pagination.pages)
                setTotalCircuits(data.pagination.total)
            }
        } catch (error) {
            console.error("Failed to fetch circuits:", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteCircuit = async (id: string) => {
        if (!confirm("Are you sure you want to delete this circuit?")) return

        try {
            const response = await fetch(`/api/admin/circuits/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                fetchCircuits()
            }
        } catch (error) {
            console.error("Failed to delete:", error)
        }
    }

    const filteredCircuits = circuits.filter(circuit =>
        circuit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circuit.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Circuits</h1>
                    <p className="text-sm text-muted-foreground mt-1">{circuits.length} total circuits</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/dashboard/circuits/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Circuit
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search circuits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
            </div>

            {/* Circuits Table */}
            {filteredCircuits.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <h3 className="text-lg font-medium text-foreground mb-2">No circuits found</h3>
                    <p className="text-muted-foreground mb-4">Get started by creating your first circuit</p>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/dashboard/circuits/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Circuit
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {filteredCircuits.map((circuit) => (
                                <tr key={circuit.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{circuit.name}</div>
                                                <div className="text-sm text-muted-foreground">/{circuit.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-muted text-foreground rounded capitalize">
                                            {circuit.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {circuit.duration} days
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                        ${circuit.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            {circuit.featured && (
                                                <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground border border-border rounded">
                                                    Featured
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${circuit.active
                                                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                                : "bg-muted text-muted-foreground border border-border"
                                                }`}>
                                                {circuit.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => window.location.href = `/dashboard/circuits/${circuit.id}/edit`}
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCircuit(circuit.id)}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted/30">
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
                                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalCircuits)}</span> of{" "}
                                        <span className="font-medium">{totalCircuits}</span> results
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                        size="sm"
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
                                                className="w-8 h-8 p-0"
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

