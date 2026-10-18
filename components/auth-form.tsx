'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

const inputClass =
  'h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))

    const result = isSignUp
      ? await authClient.signUp.email({ email, password, name: String(form.get('name')) })
      : await authClient.signIn.email({ email, password })

    if (result.error) {
      setError(
        isSignUp
          ? 'We could not create that account. Check your details and try again.'
          : 'Incorrect email or password.',
      )
      setPending(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl shadow-primary/10"
    >
      <h1 className="font-display text-3xl font-semibold">
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isSignUp
          ? 'Save your flashcard schedule, quiz scores and paper progress.'
          : 'Sign in to pick up where you left off.'}
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        {isSignUp && (
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Name
            <input name="name" required autoComplete="name" className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className={inputClass}
          />
          {isSignUp && (
            <span className="text-xs font-normal text-muted-foreground">At least 8 characters</span>
          )}
        </label>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="h-11 text-base">
          {pending ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account?' : 'New to Pathwise?'}{' '}
        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {isSignUp ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </motion.div>
  )
}
