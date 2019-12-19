import { useEffect, useRef } from 'react'

const useDidUpdate = (callback, deps) => {
  const didMount = useRef<boolean>(false)
  useEffect(() => {
    if (didMount.current) {
      console.log(callback)
      callback()
    } else {
      console.log('aaa')
      didMount.current = true
    }
  }, deps)
}

export default useDidUpdate
