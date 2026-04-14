'use client'

import Script from 'next/script'

export default function IClosedWidget() {
  return (
    <Script
      src="https://app.iclosed.io/assets/widget.js"
      strategy="lazyOnload"
    />
  )
}
