import React from 'react'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '~/hooks/useAuth'

const DashFooter = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { username, status } = useAuth()

  const onGoHoneClicked = () => navigate('/dash')

  let goHomeButton: JSX.Element | null = null
  if (pathname !== '/dash') {
    goHomeButton = (
      <button className="dash-footer__button icon-button" title="Home" onClick={onGoHoneClicked}>
        <FontAwesomeIcon icon={faHouse} />
      </button>
    )
  }

  const content = (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  )

  return content
}

export default DashFooter
