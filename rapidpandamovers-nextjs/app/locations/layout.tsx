import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Service Areas | Rapid Panda Movers | Miami Moving Services',
  description: 'Professional moving services throughout Miami-Dade County. We serve Miami, Coral Gables, Miami Beach, Hialeah, Doral, Aventura, Kendall, and surrounding areas.',
  keywords: 'Miami moving services, Coral Gables movers, Miami Beach moving, Hialeah movers, Doral moving, Aventura movers, Kendall moving, Homestead movers',
}

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
