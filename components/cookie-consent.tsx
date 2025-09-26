'use client'

import CookieConsent from 'react-cookie-consent'
import Link from 'next/link'

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Akzeptieren"
      declineButtonText="Ablehnen"
      cookieName="pagetopic-consent"
      style={{
        background: '#2B373B',
        alignItems: 'center',
        fontSize: '14px'
      }}
      buttonStyle={{
        background: '#4CAF50',
        color: '#ffffff',
        fontSize: '14px',
        padding: '10px 20px',
        borderRadius: '4px'
      }}
      declineButtonStyle={{
        background: '#f44336',
        color: '#ffffff',
        fontSize: '14px',
        padding: '10px 20px',
        borderRadius: '4px',
        marginLeft: '10px'
      }}
      expires={150}
      enableDeclineButton
      onAccept={() => {
        // Enable analytics when user accepts
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('cookies-accepted', 'true')
        }
      }}
      onDecline={() => {
        // Disable analytics when user declines
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('cookies-accepted', 'false')
        }
      }}
    >
      Diese Website verwendet Cookies, um die Benutzererfahrung zu verbessern.
      Weitere Informationen finden Sie in unserer{' '}
      <Link href="/datenschutz" className="underline text-blue-300">
        Datenschutzerklärung
      </Link>
      .
    </CookieConsent>
  )
}