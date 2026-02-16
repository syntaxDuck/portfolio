import { useEffect } from 'react'

export function useBodyScroll(isDisabled: boolean) {
  useEffect(() => {
    if (isDisabled) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isDisabled])
}
