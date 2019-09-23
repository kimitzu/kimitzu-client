import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type InfiniteScroll = (callback: () => void) => [boolean, Dispatch<SetStateAction<boolean>>]

const useInfiniteScroll: InfiniteScroll = callback => {
  const [isFetching, setIsFetching] = useState<boolean>(false)
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    if (!isFetching) {
      return
    }
    callback()
  }, [isFetching])
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    ) {
      return
    }
    setIsFetching(true)
  }
  return [isFetching, setIsFetching]
}

export default useInfiniteScroll
