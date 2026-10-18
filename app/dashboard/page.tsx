import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { getDashboard } from '@/lib/queries'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const data = await getDashboard(session.user.id)

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <DashboardView name={session.user.name} data={data} />
    </main>
  )
}
