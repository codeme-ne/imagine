'use client'

import { usePathname } from 'next/navigation'
import Footer from './footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't show footer on legal pages
  const isLegalPage = pathname.startsWith('/impressum') || 
                      pathname.startsWith('/datenschutz') || 
                      pathname.startsWith('/agb')
  
  if (isLegalPage) {
    return null
  }
  
  return <Footer />
}