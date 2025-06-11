import ErrorMessage from '@/components/tx/ErrorMessage'
import { Typography } from '@mui/material'
import ExternalLink from '@/components/common/ExternalLink'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'

export const KromaSunsetWarning = () => {
  const isFeatureEnabled = useHasFeature(FEATURES.KROMA_MAINNET_SUNSET_BANNER)

  if (!isFeatureEnabled) return null

  return (
    <ErrorMessage level="warning" title="Kroma Mainnet Sunsetting & Merge Plan">
      <Typography display="inline" mr={1}>
        Dear users, Support for Kroma Mainnet will end soon. Please withdraw your funds before June 26th, 2025.
      </Typography>
      <Typography display="inline">
        For further details regarding the merger and its implications, please refer to this{' '}
        <ExternalLink href="https://zkcandy.medium.com/zkcandy-x-kroma-merger-a-unified-vision-for-ai-powered-onchain-entertainment-2a7a25a16b2d">
          Medium article
        </ExternalLink>
      </Typography>
    </ErrorMessage>
  )
}
