import React, { useEffect, useState } from 'react'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import { User } from '../users/usersApiSlice'
import { useAddNewNoteMutation } from './notesApiSlice'

type PropsType = {
  users: User[]
}

const NewNoteForm = ({ users }: PropsType) => {
  const [addNewNote, { isLoading, isSuccess, isError }] = useAddNewNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState<string>('')
  const [text, setText] = useState<string>('')
  const [userId, setUserId] = useState<string>(users[0].id)

  useEffect(() => {
    if (isSuccess) {
      setTitle('')
      setText('')
      setUserId('')
      navigate('/dash/notes')
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)
  const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value)

  const canSave: boolean = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNoteClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (canSave) {
      await addNewNote({ user: userId, title, text })
    }
  }

  const options: JSX.Element | JSX.Element[] = users.map(user => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    )
  })

  const errClass: string = isError ? 'errmsg' : 'offscreen'
  const validTitleClass: string = !title ? 'form__input--incomplete' : ''
  const validTextClass: string = !text ? 'form__input--incomplete' : ''

  const content: JSX.Element = (
    <>
      <p className={errClass}>{`Fetching error ><!`}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <label className="form__label form__checkbox-container" htmlFor="username">
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </form>
    </>
  )

  return content
}

export default NewNoteForm
