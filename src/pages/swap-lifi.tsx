import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Typography } from '@mui/material'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'
import { useRouter } from 'next/router'

const LifiSwapWidgetNoSSR = dynamic(() => import('@/features/lifi'), { ssr: false })

const LifiSwapPage: NextPage = () => {
  const router = useRouter()
  const { token, amount } = router.query
  const isFeatureEnabled = useHasFeature(FEATURES.NATIVE_SWAPS_LIFI)

  let sell = undefined
  if (token && amount) {
    sell = {
      asset: token as string,
      amount: amount as string,
    }
  }

  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Swap'}</title>
      </Head>

      <main style={{ height: 'calc(100vh - 52px)' }}>
        {isFeatureEnabled === true ? (
          <LifiSwapWidgetNoSSR sell={sell} />
        ) : isFeatureEnabled === false ? (
          <Typography textAlign="center" my={3}>
            Lifi Swaps are not supported on this network.
          </Typography>
        ) : null}
      </main>
    </>
  )
}

export default LifiSwapPage
