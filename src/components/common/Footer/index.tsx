import type { ReactElement } from 'react'
import { SvgIcon, Typography } from '@mui/material'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
import ExternalLink from '../ExternalLink'
import MUILink from '@mui/material/Link'
import { HELP_CENTER_URL } from '@/config/constants'
import darkPalette from '@/components/theme/darkPalette'
import ProtofireLogo from '@/public/images/protofire-logo.svg'
import AppstoreButton from '../AppStoreButton'

const footerPages = [
  AppRoutes.welcome.index,
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.cookie,
  AppRoutes.terms,
  AppRoutes.licenses,
]

const Footer = (): ReactElement | null => {
  const router = useRouter()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  return (
    <footer className={css.container}>
      <ul>
        <li>
          <ExternalLink href={HELP_CENTER_URL} noIcon sx={{ span: { textDecoration: 'underline' } }}>
            Help
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://protofire.io/" noIcon>
            <SvgIcon component={FileOpenIcon} inheritViewBox fontSize="inherit" sx={{ mr: 0.5 }} /> Protofire
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`} noIcon>
            <SvgIcon component={GitHubIcon} inheritViewBox fontSize="inherit" sx={{ mr: 0.5 }} /> v{packageJson.version}
          </ExternalLink>
        </li>
        <li>
          <Typography variant="caption">
            Supported by{' '}
            <SvgIcon
              component={ProtofireLogo}
              inheritViewBox
              fontSize="small"
              sx={{ verticalAlign: 'middle', mx: 0.5 }}
            />
            <MUILink href="https://protofire.io" sx={{ color: darkPalette.primary.main, textDecoration: 'none' }}>
              Protofire
            </MUILink>
          </Typography>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
