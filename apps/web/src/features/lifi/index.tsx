import { Box, useTheme } from '@mui/material'
import css from './styles.module.css'
import useLifiSwapConsent from './useLifiSwapConsent'
import Disclaimer from '@/components/common/Disclaimer'
import WidgetDisclaimer from '@/components/common/WidgetDisclaimer'
import AppFrame from '@/components/safe-apps/AppFrame'
import { getEmptySafeApp } from '@/components/safe-apps/utils'
import { LIFI_WIDGET_URL } from '@/config/constants'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useDarkMode } from '@/hooks/useDarkMode'
import useSafeInfo from '@/hooks/useSafeInfo'
import useChainId from '@/hooks/useChainId'
import type { SplitSubvariant, WidgetConfig } from './types/widget'
import React from 'react'

type Params = {
  sell?: {
    // The token address
    asset: string
    amount: string
    split?: SplitSubvariant
  }
}

const LifiSwapWidget = ({ sell }: Params) => {
  const { palette } = useTheme()
  const darkMode = useDarkMode()
  const chainId = useChainId()
  const { safeLoading } = useSafeInfo()
  const { isConsentAccepted, onAccept } = useLifiSwapConsent()

  //temp fix to quick check dark mode right after initial load
  const checkDarkMode = () => {
    const theme = document.documentElement.getAttribute('data-theme')
    return theme === 'dark'
  }

  const INITIAL_PARAMS: WidgetConfig = {
    integrator: 'protofire-safe',
    fee: 0.005,
    variant: 'compact',
    subvariant: 'split',
    subvariantOptions: {
      split: sell?.split ?? 'swap',
    },
    chains: { from: { allow: [+chainId] } },
    appearance: darkMode || checkDarkMode() ? 'dark' : 'light',
    theme: {
      shape: {
        borderRadius: 15,
      },
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
        maxHeight: '96vh',
      },
    },
    hiddenUI: ['walletMenu'],
    fromChain: +chainId,
    toChain: +chainId,
    fromToken: sell?.asset,
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
    const handleIframeMessage = (event: MessageEvent) => {
      const { type } = event.data
      if (type === 'iframeReady') {
        console.log('Parent: Iframe is ready')
        const window = iframeRef.current?.contentWindow
        if (window) {
          window.postMessage(params, '*')
        }
      }
    }

    window.addEventListener('message', handleIframeMessage)

    return () => {
      window.removeEventListener('message', handleIframeMessage)
    }
  }, [])

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
