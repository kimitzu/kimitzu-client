import { useEffect, useRef } from 'react'

const useDidUpdate = (callback, deps) => {
  const didMount = useRef<boolean>(false)
  useEffect(() => {
    if (didMount.current) {
      callback()
    } else {
      didMount.current = true
    }
  }, deps)
}

export default useDidUpdate
