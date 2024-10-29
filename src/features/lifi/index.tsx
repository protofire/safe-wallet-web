import { Box, useTheme } from '@mui/material'
import css from './styles.module.css'
import useSwapConsent from './useSwapConsent'
import Disclaimer from '@/components/common/Disclaimer'
import WidgetDisclaimer from '@/components/common/WidgetDisclaimer'
import AppFrame from '@/components/safe-apps/AppFrame'
import { getEmptySafeApp } from '@/components/safe-apps/utils'
import { LIFI_WIDGET_URL } from '@/config/constants'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import useSafeInfo from '@/hooks/useSafeInfo'
import { ChainType } from '@lifi/types'
import useChainId from '@/hooks/useChainId'
import type { WidgetConfig } from './types/widget'

const LifiSwapWidget = () => {
  const { palette } = useTheme()
  const darkMode = useDarkMode()
  const chainId = useChainId()
  const { safeAddress, safeLoading } = useSafeInfo()
  const { isConsentAccepted, onAccept } = useSwapConsent()

  const supportedChains = [42161, 10, 8453, 56, 11235, 59144, 81457]

  const INITIAL_PARAMS: WidgetConfig = {
    integrator: 'protofire',
    variant: 'compact',
    subvariant: 'default',
    chains: { from: { allow: [+chainId] }, to: { allow: supportedChains } },
    appearance: darkMode ? 'dark' : 'light',
    toAddress: {
      address: safeAddress,
      chainType: ChainType.EVM,
    },
    fromChain: +chainId,
    toChain: +chainId,
  }

  const [params, setParams] = useState<WidgetConfig>(INITIAL_PARAMS)

  const iframeRef: MutableRefObject<HTMLIFrameElement | null> = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    setParams((params) => ({
      ...params,
      appearance: darkMode ? 'dark' : 'light',
      fromChain: +chainId,
    }))
  }, [palette, darkMode, chainId])

  useEffect(() => {
    const iframeElement = document.querySelector('#lifiWidget iframe')
    if (iframeElement) {
      iframeRef.current = iframeElement as HTMLIFrameElement
    }
  }, [isConsentAccepted, safeLoading])

  useEffect(() => {
    const window = iframeRef.current?.contentWindow
    if (window) {
      window.postMessage(params, '*')
    }
  }, [params])

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
    <Box className={css.swapWidget} id="lifiWidget">
      <AppFrame
        appUrl={safeAppData.url}
        allowedFeaturesList="clipboard-read; clipboard-write"
        safeAppFromManifest={safeAppData}
        isNativeEmbed
      />
    </Box>
  )
}

export default LifiSwapWidget
