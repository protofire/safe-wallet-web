import { networks } from '@safe-global/protocol-kit/dist/src/utils/eip-3770/config'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
/**
 * A static shortName<->chainId dictionary
 * E.g.:
 *
 * {
 *   eth: '1',
 *   gor: '5',
 *   ...
 * }
 */
type Chains = Record<string, string>

const chains = networks.reduce<Chains>((result, { shortName, chainId }) => {
  result[shortName] = chainId.toString()
  return result
}, {})

export type ExternalChainInfo = Pick<ChainInfo, 'chainId' | 'chainName' | 'shortName' | 'theme'> & {
  chainLogoUri?: string | null
  externalHref: string
}

export const EXTERNAL_NETWORKS: ExternalChainInfo[] = [
  {
    chainId: '81457',
    chainName: 'Blast',
    chainLogoUri: 'https://safe-transaction-assets.safe.global/chains/81457/chain_logo.png',
    shortName: 'blast',
    theme: {
      textColor: '#ffffff',
      backgroundColor: '#F01A37',
    },
    externalHref: 'https://app.safe.global/welcome/accounts?chain=blast',
  },
]

export default chains
