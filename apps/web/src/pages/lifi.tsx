import type { NextPage } from 'next'
import Head from 'next/head'
// import dynamic from 'next/dynamic'
// import { Typography } from '@mui/material'
// import { useHasFeature } from '@/hooks/useChains'
// import { FEATURES } from '@/utils/chains'

//const LifiSwapWidgetNoSSR = dynamic(() => import('@/features/lifi'), { ssr: false })

const LifiSwapPage: NextPage = () => {
  // const isFeatureEnabled = useHasFeature(FEATURES.NATIVE_SWAPS_LIFI)

  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Lifi Swap'}</title>
      </Head>

      <main style={{ height: 'calc(100vh - 52px)' }}></main>
    </>
  )
}

export default LifiSwapPage
