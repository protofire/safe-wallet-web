import { type ReactElement } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import css from './styles.module.css'
import Link from 'next/link'
import MUILink from '@mui/material/Link'
import { useAppDispatch, useAppSelector } from '@/store'
import { closePSABanner, selectPSABanner } from '@/store/bannerSlice'

const BANNERS: Record<string, ReactElement | string> = {
  '*': (
    <>
      ZkSync is now integrated into{' '}
      <Link href="https://app.safe.global" passHref>
        <MUILink target="_blank" rel="noreferrer">
          Safe Global
        </MUILink>
      </Link>
      . Please be mindful of transactions that are not yet fully confirmed or not executed. Your Safe can be accessed
      both here and through Safe Global.{' '}
    </>
  ),
}

const WARNING_BANNER = 'WARNING_BANNER'

const PsaBanner = (): ReactElement | null => {
  const banner = BANNERS['*']
  const isEnabled = true

  const dispatch = useAppDispatch()
  const open = useAppSelector(selectPSABanner).open
  const showBanner = isEnabled && banner && open

  const onClose = () => {
    dispatch(closePSABanner())
  }

  return showBanner ? (
    <div className={css.banner}>
      <div className={css.wrapper}>
        <div className={css.content}>{banner}</div>
        <CloseIcon className={css.close} onClick={onClose} />
      </div>
    </div>
  ) : null
}

export default PsaBanner
