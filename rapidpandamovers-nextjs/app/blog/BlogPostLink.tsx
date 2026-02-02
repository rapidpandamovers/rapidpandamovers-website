'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BlogPostLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function BlogPostLink({ href, children, className }: BlogPostLinkProps) {
  const pathname = usePathname()

  const handleClick = () => {
    // Store the current blog page URL in sessionStorage
    if (pathname === '/blog' || pathname.startsWith('/blog/page/')) {
      sessionStorage.setItem('lastBlogPage', pathname)
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
