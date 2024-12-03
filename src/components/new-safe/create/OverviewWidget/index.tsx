import WalletOverview from 'src/components/common/WalletOverview'
import useWallet from '@/hooks/wallets/useWallet'
import { Box, Card, Grid, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import SafeLogo from '@/public/images/welcome/logo_text_protofire_safe.svg'
import useChainId from '@/hooks/useChainId'
import css from '@/components/new-safe/create/OverviewWidget/styles.module.css'
import ConnectWalletButton from '@/components/common/ConnectWallet/ConnectWalletButton'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import NetworkLogosList from '@/features/multichain/components/NetworkLogosList'
import ChainLogo from '@/components/common/ChainLogo'
import classnames from 'classnames'
import { AppRoutes } from '@/config/routes'
import type { Url } from 'next/dist/shared/lib/router/router'
import { useRouter } from 'next/router'
import Link from 'next/link'

const LOGO_DIMENSIONS = '50px'
function getLogoLink(router: ReturnType<typeof useRouter>): Url {
  return router.pathname === AppRoutes.home || !router.query.safe
    ? router.pathname === AppRoutes.welcome.accounts
      ? AppRoutes.welcome.index
      : AppRoutes.welcome.accounts
    : { pathname: AppRoutes.home, query: { safe: router.query.safe } }
}
const OverviewWidget = ({ safeName, networks }: { safeName: string; networks: ChainInfo[] }): ReactElement | null => {
  const chainId = useChainId()
  const wallet = useWallet()
  const router = useRouter()
  const logoHref = getLogoLink(router)
  const rows = [
    ...(wallet ? [{ title: 'Wallet', component: <WalletOverview wallet={wallet} /> }] : []),
    ...(safeName !== '' ? [{ title: 'Name', component: <Typography>{safeName}</Typography> }] : []),
    ...(networks.length
      ? [
          {
            title: 'Network(s)',
            component: <NetworkLogosList networks={networks} />,
          },
        ]
      : []),
  ]

  return (
    <Grid item xs={12}>
      <Card className={css.card}>
        <div className={css.header}>
          <div className={classnames(css.element, css.hideMobile, css.logo)}>
            <Link href={logoHref} passHref>
              {chainId ? <ChainLogo /> : <SafeLogo alt="Safe logo" />}
            </Link>
          </div>{' '}
          <Typography variant="h4">Your Safe Account preview</Typography>
        </div>
        {wallet ? (
          rows.map((row) => (
            <div key={row.title} className={css.row}>
              <Typography variant="body2">{row.title}</Typography>
              {row.component}
            </div>
          ))
        ) : (
          <Box p={2}>
            <Typography variant="body2" color="border.main" textAlign="center" width={1} mb={1}>
              Connect your wallet to continue
            </Typography>
            <ConnectWalletButton />
          </Box>
        )}
      </Card>
    </Grid>
  )
}

export default OverviewWidget
