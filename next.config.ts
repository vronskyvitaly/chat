import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // onDemandEntries: {
  //   // отключает агрессивный кэш dev-режима
  //   maxInactiveAge: 0
  // },
  enablePrerenderSourceMaps: true,
  webpack: config => {
    config.cache = false // отключает кеш webpаck
    return config
  }
  /* config options here */
}

export default nextConfig
