import { type ReactElement, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import local from '@/services/local-storage/local'
import css from './styles.module.css'

const BANNERS: Record<string, ReactElement | string> = {
  '*': (
    <>
      ZkSync is now integrated into{' '}
      <a href="https://app.safe.global" target="_blank" rel="noreferrer">
        Safe Global
      </a>
      .Please be mindful of transactions that are not yet fully confirmed or not executed. Your Safe can be accessed
      both here and through Safe Global.{' '}
    </>
  ),
}

const WARNING_BANNER = 'WARNING_BANNER'

const PsaBanner = (): ReactElement | null => {
  const banner = BANNERS['*']
  const isEnabled = true
  const isClosed = local.getItem<boolean>(`${WARNING_BANNER}_closed`) ?? false

  const [closed, setClosed] = useState(isClosed)

  const showBanner = isEnabled && banner && !closed

  const onClose = () => {
    setClosed(true)
    local.setItem(`${WARNING_BANNER}_closed`, true)
  }

  useEffect(() => {
    document.body.setAttribute('data-with-banner', showBanner.toString())
  }, [showBanner])

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
