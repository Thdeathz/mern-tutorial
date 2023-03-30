import { useEffect, useState } from 'react'

const usePersist = () => {
  const [persist, setPersist] = useState<boolean>(
    Boolean(localStorage.getItem('persist') === 'true') || false
  )

  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist))
  }, [persist])

  return { persist, setPersist }
}

export default usePersist
