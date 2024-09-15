import { useDarkMode } from '@/hooks/useDarkMode'
import { useCurrentChain } from '@/hooks/useChains'
import Image from 'next/image'

export default function ChainLogo() {
  const chain = useCurrentChain()
  const darkMode = useDarkMode()
  const src = darkMode
    ? `/images/chains-logo/${chain?.chainId}-dark.svg`
    : `/images/chains-logo/${chain?.chainId}-light.svg`

  return <Image src={src} alt="Chain logo" width={130} height={30} />
}
