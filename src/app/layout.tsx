import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import content from '@/content/site-content.json'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  keywords: content.metadata.keywords,
  authors: [{ name: content.metadata.author }],
  openGraph: {
    title: content.metadata.title,
    description: content.metadata.description,
    url: 'https://acedzn.com',
    siteName: content.metadata.author,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: content.metadata.title,
    description: content.metadata.description,
    creator: content.metadata.social.twitter_handle,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
