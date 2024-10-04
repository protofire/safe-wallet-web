import { GeoblockingContext } from '@/components/common/GeoblockingProvider'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'
import { useContext } from 'react'

const useIsSwapFeatureEnabled = () => {
  const isBlockedCountry = useContext(GeoblockingContext)
  return useHasFeature(FEATURES.NATIVE_SWAPS) || useHasFeature(FEATURES.NATIVE_SWAPS_LIFI) && !isBlockedCountry
}

export default useIsSwapFeatureEnabled
