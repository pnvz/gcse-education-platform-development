import { BookOpenCheck } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { NavLinks } from '@/components/nav-links'
import { SignOutButton } from '@/components/sign-out-button'
import { getSession } from '@/lib/session'

export async function SiteHeader() {
  const session = await getSession().catch(() => null)
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenCheck className="size-4" aria-hidden />
          </span>
          Pathwise
        </Link>

        <NavLinks />

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-32 truncate text-sm text-muted-foreground lg:block">
                {user.name}
              </span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: 'ghost', size: 'lg' })}
              >
                Sign in
              </Link>
              <Link href="/sign-up" className={buttonVariants({ size: 'lg' })}>
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
