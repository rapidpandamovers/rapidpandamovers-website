'use client'

import { Link, usePathname } from '@/i18n/routing'

interface BlogPostLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function BlogPostLink({ href, children, className }: BlogPostLinkProps) {
  const pathname = usePathname()

  const handleClick = () => {
    // Store the current blog page URL in sessionStorage
    if (pathname === '/blog' || pathname.startsWith('/blog/page/') || pathname.startsWith('/blog/pagina/')) {
      sessionStorage.setItem('lastBlogPage', pathname)
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
