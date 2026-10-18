import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Create account' }

export default async function SignUpPage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return (
    <main className="grid min-h-[calc(100svh-4rem)] place-items-center px-4 py-12">
      <AuthForm mode="sign-up" />
    </main>
  )
}
