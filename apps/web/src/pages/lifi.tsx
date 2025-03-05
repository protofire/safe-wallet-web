import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import useIsLifiFeatureEnabled from '@/features/lifi/hooks/useIsLifiFeatureEnabled'

const LifiSwapWidgetNoSSR = dynamic(() => import('@/features/lifi'), { ssr: false })

const LifiSwapPage: NextPage = () => {
  const router = useRouter()
  const { token, amount } = router.query
  const isFeatureEnabled = useIsLifiFeatureEnabled()

  let sell = undefined
  if (token && amount) {
    sell = {
      asset: token as string,
      amount: amount as string,
    }
  }

  return (
    <>
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
