import React from 'react'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'

const DashFooter = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

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
      <p>Current User: </p>
      <p>Status:</p>
    </footer>
  )

  return content
}

export default DashFooter
