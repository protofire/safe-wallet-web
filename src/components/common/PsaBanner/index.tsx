import { type ReactElement } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import css from './styles.module.css'
import Link from 'next/link'
import MUILink from '@mui/material/Link'
import { useAppDispatch, useAppSelector } from '@/store'
import { closePSABanner, selectPSABanner } from '@/store/bannerSlice'

type BannerType = {
  [key: string]: ReactElement | string
}

const BANNERS: BannerType = {
  WARNING_BANNER: (
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
const PsaBanner = (): ReactElement | null => {
  const banner = BANNERS['WARNING_BANNER']

  const dispatch = useAppDispatch()
  const open = useAppSelector(selectPSABanner).open
  const showBanner = banner && open

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
