"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Map, Calendar, Mail, LogOut, User, FileText } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Circuits", href: "/dashboard/circuits", icon: Map },
    { name: "Blog", href: "/dashboard/blog", icon: FileText },
    { name: "Trip Requests", href: "/dashboard/trip-requests", icon: Calendar },
    { name: "Messages", href: "/dashboard/messages", icon: Mail },
    { name: "Profile", href: "/dashboard/profile", icon: User },
]

export function SidebarContent() {
    const { user, logout } = useAuth()
    const pathname = usePathname()

    return (
        <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/logo_1.PNG"
                        alt="TimolaAdventures"
                        width={180}
                        height={60}
                        className="h-16 w-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === item.href || pathname?.startsWith(item.href + "/")

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                    ? "bg-secondary/80 text-secondary-foreground"
                                    : "text-foreground/70 hover:bg-secondary/80 hover:text-secondary-foreground/80"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-sidebar-border">
                <div className="mb-2 px-3 py-2 text-sm font-medium text-sidebar-foreground/70 flex items-center gap-3">
                    <User className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export function Sidebar() {
    return (
        <div className="hidden lg:flex h-screen sticky top-0 left-0 w-64 flex-col">
            <SidebarContent />
        </div>
    )
}
