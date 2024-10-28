// import { type MutableRefObject, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
// import {
//   type SafeAppData,
// } from '@safe-global/safe-gateway-typescript-sdk/dist/types/safe-apps'

import css from './styles.module.css'
import useSwapConsent from './useSwapConsent'
import Disclaimer from '@/components/common/Disclaimer'
import WidgetDisclaimer from '@/components/common/WidgetDisclaimer'

// import { ChainType, WidgetConfig } from '@lifi/widget'
import AppFrame from '@/components/safe-apps/AppFrame'
import { getEmptySafeApp } from '@/components/safe-apps/utils'
import { LIFI_WIDGET_URL } from '@/config/constants'

const LifiSwapWidget = () => {
  // const { palette } = useTheme()
  // const darkMode = useDarkMode()
  // const chainId = useChainId()
  // const { safeAddress, safeLoading } = useSafeInfo()
  const { isConsentAccepted, onAccept } = useSwapConsent()

  // const [params, setParams] = useState<WidgetConfig>({
  //   integrator: "protofire",
  //   variant: "compact",
  //   subvariant: "default",
  //   appearance: darkMode ? 'dark' : 'light',
  //   toAddress: {
  //     address: safeAddress,
  //     chainType: ChainType.EVM,
  //   },
  //   fromChain: +chainId,
  // })

  // useEffect(() => {
  //   setParams((params) => ({
  //     ...params,
  //     appearance: darkMode ? 'dark' : 'light',
  //     fromChain: +chainId,
  //   }))
  // }, [palette, darkMode, chainId])

  // const iframeRef: MutableRefObject<HTMLIFrameElement | null> = useRef<HTMLIFrameElement | null>(null)

  // useEffect(() => {
  //   const iframeElement = document.querySelector('#lifiWidget iframe')
  //   if (iframeElement) {
  //     iframeRef.current = iframeElement as HTMLIFrameElement
  //   }
  // }, [isConsentAccepted, safeLoading])

  // const appData: SafeAppData = useMemo(
  //   () => ({
  //     id: 1,
  //     url: LIFI_WIDGET_URL,
  //     name: 'LifiSwap',
  //     iconUrl: darkMode ? './images/common/safe-swap-dark.svg' : './images/common/safe-swap.svg',
  //     description: 'Safe Apps',
  //     chainIds: ["42161", "10", "8453", "56", "11235", "59144"],
  //     accessControl: { type: SafeAppAccessPolicyTypes.NoRestrictions },
  //     tags: ['safe-apps'],
  //     features: [SafeAppFeatures.BATCHED_TRANSACTIONS],
  //     socialProfiles: [],
  //   }),
  //   [darkMode],
  // )

  // useCustomAppCommunicator(iframeRef, appData, chain)

  if (!isConsentAccepted) {
    return (
      <Disclaimer
        title="Note"
        content={<WidgetDisclaimer widgetName="Lifi Widget" />}
        onAccept={onAccept}
        buttonText="Continue"
      />
    )
  }
  const safeAppData = getEmptySafeApp(LIFI_WIDGET_URL)

  return (
    // TODO: wrap lifi into external iframe
    <Box className={css.swapWidget} id="lifiWidget">
      <AppFrame
        appUrl={safeAppData.url}
        allowedFeaturesList="clipboard-read; clipboard-write"
        safeAppFromManifest={safeAppData}
      />

      {/* The preferred scenario below */}
      {/* {safeLoading ? <WidgetSkeleton config={params!} /> :  <LiFiWidget
          config={params}
          integrator="protofire"
        />}  */}
    </Box>
  )
}

export default LifiSwapWidget
