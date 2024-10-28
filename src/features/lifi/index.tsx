// import { type MutableRefObject, useEffect, useRef, useState } from 'react'
import { Box, useTheme } from '@mui/material'
// import {
//   type SafeAppData,
// } from '@safe-global/safe-gateway-typescript-sdk/dist/types/safe-apps'

import css from './styles.module.css'
import useSwapConsent from './useSwapConsent'
import Disclaimer from '@/components/common/Disclaimer'
import WidgetDisclaimer from '@/components/common/WidgetDisclaimer'
import AppFrame from '@/components/safe-apps/AppFrame'
import { getEmptySafeApp } from '@/components/safe-apps/utils'
import { LIFI_WIDGET_URL } from '@/config/constants'
import type { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'
import { SafeAppAccessPolicyTypes, SafeAppFeatures } from '@safe-global/safe-gateway-typescript-sdk'
import type { MutableRefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import useSafeInfo from '@/hooks/useSafeInfo'
import type { WidgetConfig } from '@lifi/widget'
import { ChainType } from '@lifi/widget'
import useChainId from '@/hooks/useChainId'

const LifiSwapWidget = () => {
  const { palette } = useTheme()
  const darkMode = useDarkMode()
  const chainId = useChainId()
  const { safeAddress, safeLoading } = useSafeInfo()
  const { isConsentAccepted, onAccept } = useSwapConsent()

  const supportedChains = ['42161', '10', '8453', '56', '11235', '59144']

  const [params, setParams] = useState<WidgetConfig>({
    integrator: 'protofire',
    variant: 'compact',
    subvariant: 'default',
    appearance: darkMode ? 'dark' : 'light',
    toAddress: {
      address: safeAddress,
      chainType: ChainType.EVM,
    },
    fromChain: +chainId,
    toChain: +chainId,
  })

  const iframeRef: MutableRefObject<HTMLIFrameElement | null> = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    setParams((params) => ({
      ...params,
      appearance: darkMode ? 'dark' : 'light',
      fromChain: +chainId,
    }))
    const window = iframeRef.current?.contentWindow
    if (window) {
      window.postMessage(params, '*')
    }
    // Temp
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette, darkMode, chainId])

  useEffect(() => {
    const iframeElement = document.querySelector('#lifiWidget iframe')
    if (iframeElement) {
      iframeRef.current = iframeElement as HTMLIFrameElement
      const window = iframeRef.current?.contentWindow
      if (window) {
        window.postMessage(params, '*')
      }
    }
  }, [isConsentAccepted, safeLoading, params])

  const appData: SafeAppData = useMemo(
    () => ({
      id: 1,
      url: LIFI_WIDGET_URL,
      name: 'LifiSwap',
      iconUrl: darkMode ? './images/common/safe-swap-dark.svg' : './images/common/safe-swap.svg',
      description: 'Safe Apps',
      chainIds: supportedChains,
      accessControl: { type: SafeAppAccessPolicyTypes.NoRestrictions },
      tags: ['safe-apps'],
      features: [SafeAppFeatures.BATCHED_TRANSACTIONS],
      socialProfiles: [],
    }),
    // Temp
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [darkMode],
  )

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

  const safeAppData = getEmptySafeApp(LIFI_WIDGET_URL, appData)

  return (
    <Box className={css.swapWidget} id="lifiWidget">
      <AppFrame
        appUrl={safeAppData.url}
        allowedFeaturesList="clipboard-read; clipboard-write"
        safeAppFromManifest={safeAppData}
      />
    </Box>
  )
}

export default LifiSwapWidget
