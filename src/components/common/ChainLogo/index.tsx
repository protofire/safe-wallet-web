import { useDarkMode } from '@/hooks/useDarkMode'
import { useCurrentChain } from '@/hooks/useChains'
import ImageFallback from '../ImageFallback'
import SafeLogo from '@/public/images/logo-text.svg'

export default function ChainLogo() {
  const chain = useCurrentChain()
  const darkMode = useDarkMode()
  const src = darkMode
    ? `/images/chains-logo/${chain?.chainId}-dark.svg`
    : `/images/chains-logo/${chain?.chainId}-light.svg`
  const fallbackComponent = <SafeLogo width={130} height={30} />

  return <ImageFallback src={src} fallbackComponent={fallbackComponent} alt="Chain logo" width={130} height={30} />
}
