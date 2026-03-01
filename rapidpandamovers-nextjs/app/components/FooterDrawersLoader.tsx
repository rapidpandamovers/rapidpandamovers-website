'use client'

import dynamic from 'next/dynamic'

const FooterDrawers = dynamic(() => import('./FooterDrawers'), { ssr: false })

export default FooterDrawers
