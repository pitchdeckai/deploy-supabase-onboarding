import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, DollarSign, LinkIcon } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="space-y-2 px-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/payouts">
              <DollarSign className="mr-2 h-4 w-4" />
              Payouts
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/developers">
              <Users className="mr-2 h-4 w-4" />
              Developers
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/attributions">
              <LinkIcon className="mr-2 h-4 w-4" />
              Attributions
            </Link>
          </Button>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/">Back to Site</Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
