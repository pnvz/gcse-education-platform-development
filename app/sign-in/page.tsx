import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Sign in' }

export default async function SignInPage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return (
    <main className="grid min-h-[calc(100svh-4rem)] place-items-center px-4 py-12">
      <AuthForm mode="sign-in" />
    </main>
  )
}
