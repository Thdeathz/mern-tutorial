import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROLE, ROLES } from '~/config/roles'
import { useDeleteUserMutation, User, useUpdateUserMutation } from './usersApiSlice'

type PropsType = {
  user: User
}

const USER_REGEX: RegExp = /^[A-z]{3,20}$/
const PWD_REGEX: RegExp = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({ user }: PropsType) => {
  const [updateUser, { isLoading, isSuccess, isError }] = useUpdateUserMutation()

  const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError }] = useDeleteUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState<string>(user.username)
  const [validUsername, setValidUsername] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [validPassword, setValidPassword] = useState<boolean>(false)
  const [roles, setRoles] = useState<ROLE[]>(user.roles)
  const [active, setActive] = useState<boolean>(user.active)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values: ROLE[] = Array.from(e.target.selectedOptions, option => option.value as ROLE)
    setRoles(values)
  }

  const onActiveChanged = () => setActive(prev => !prev)

  const onSaveUserClicked = async () => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active })
    } else {
      await updateUser({ id: user.id, username, roles, active })
    }
  }

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id })
  }

  let canSave: boolean = false
  if (password) {
    canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading
  }

  const errClass: string = isError ? 'errmsg' : 'offscreen'
  const validUserClass: string = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass: string = password && !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass: string = !Boolean(roles.length) ? 'form__input--incomplete' : ''

  const errContent: string = `Fetching error ><! Please try again later.`

  const options: JSX.Element | JSX.Element[] = Object.values(ROLES).map(role => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    )
  })

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="icon-button" title="Delete" onClick={onDeleteUserClicked}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>{' '}
          <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__label form__checkbox-container" htmlFor="user-active">
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size={3}
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  )

  return content
}

export default EditUserForm
