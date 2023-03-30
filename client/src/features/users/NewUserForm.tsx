import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddNewUserMutation } from './usersApiSlice'
import { ROLE, ROLES } from '~/config/roles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const USER_REGEX: RegExp = /^[A-z]{3,20}$/
const PWD_REGEX: RegExp = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddNewUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState<string>('')
  const [validUsername, setValidUsername] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [validPassword, setValidPassword] = useState<boolean>(false)
  const [roles, setRoles] = useState<ROLE[]>(['Employee'])

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setPassword('')
      setRoles(['Employee'])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values: ROLE[] = Array.from(e.target.selectedOptions, option => option.value as ROLE)
    setRoles(values)
  }

  const canSave: boolean = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, password, roles })
    }
  }

  const options: JSX.Element | JSX.Element[] = Object.values(ROLES).map(role => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    )
  })

  const errClass: string = isError ? 'errmsg' : 'offscreen'
  const validUserClass: string = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass: string = !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass: string = !Boolean(roles.length) ? 'form__input--incomplete' : ''

  const content = (
    <>
      <p className={errClass}>{(error as any)?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
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
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

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

export default NewUserForm
