import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import usePersist from '~/hooks/usePersist'
import { useAppSelector } from '~/hooks/useRedux'
import { useRefreshMutation } from './authApiSlice'
import { selectCurrentToken } from './authSlice'
import PulseLoader from 'react-spinners/PulseLoader'

const PersistLogin = () => {
  const { persist } = usePersist()
  const token = useAppSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState<boolean>(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || import.meta.env.VITE_NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        try {
          await refresh([])
          setTrueSuccess(true)
        } catch (error) {
          console.error(error)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  let content: JSX.Element | React.ReactElement = <></>
  if (!persist || (isSuccess && trueSuccess) || (token && isUninitialized)) {
    content = <Outlet />
  } else if (isLoading) {
    content = <PulseLoader color="#FFF" />
  } else if (isError) {
    content = (
      <p className="errmsg">
        {`${(error as any)?.data?.message} - `} <Link to="/login">Please login again</Link>
      </p>
    )
  }

  return content
}

export default PersistLogin
