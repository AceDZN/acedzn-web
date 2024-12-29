'use client'

import PostHogPageView from '@/components/PostHogPageView'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { posthogHost, posthogKey } from './utils/constants'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
      <PostHogPageView />
    </PHProvider>
  )
}
