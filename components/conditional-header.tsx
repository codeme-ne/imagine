'use client'

import { usePathname } from 'next/navigation'

export default function ConditionalHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show header on legal pages
  const isLegalPage = pathname.startsWith('/impressum') || 
                      pathname.startsWith('/datenschutz') || 
                      pathname.startsWith('/agb')
  
  if (isLegalPage) {
    return null
  }
  
  return <>{children}</>
}