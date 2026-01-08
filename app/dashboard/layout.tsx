"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Map, MessageSquare, ShoppingBag, Menu, X, LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()

    // Redirect if not admin
    if (!isPending && (!session)) {
        router.push("/login")
        return null
    } else if (!isPending && (session?.user as any).role !== "admin") {
        router.push("/access-denied")
        return null
    }

    if (isPending) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    const navigation = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Bookings", href: "/dashboard/bookings", icon: ShoppingBag },
        { name: "Tours", href: "/dashboard/tours", icon: Map },
        { name: "Messages", href: "/dashboard/messages", icon: Mail },
    ]

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                },
            },
        })
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            Timola<span className="text-secondary">Admin</span>
                        </Link>
                        <button
                            type="button"
                            className="lg:hidden -m-2.5 p-2.5 text-gray-700"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col mt-8">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                            ${isActive
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-gray-700 hover:text-primary hover:bg-gray-50"
                                                        }
                          `}
                                                >
                                                    <item.icon
                                                        className={`h-6 w-6 shrink-0 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
                                                            }`}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <button
                                    onClick={handleLogout}
                                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600 w-full"
                                >
                                    <LogOut
                                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600"
                                        aria-hidden="true"
                                    />
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <main className="lg:pl-72 pt-4 lg:pt-0">
                <div className="px-4 py-10 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    )
}
