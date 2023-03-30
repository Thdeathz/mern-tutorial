import React, { useEffect, useState } from 'react'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '../users/usersApiSlice'
import { Note, useDeleteNoteMutation, useUpdateNoteMutation } from './notesApiSlice'
import { useNavigate } from 'react-router-dom'

type PropsType = {
  note: Note
  users: User[]
}

const EditNoteForm = ({ note, users }: PropsType) => {
  const [updateNote, { isLoading, isSuccess, isError, error }] = useUpdateNoteMutation()

  const [deleteNote, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] =
    useDeleteNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState<string>(note.title)
  const [text, setText] = useState<string>(note.text)
  const [completed, setCompleted] = useState<boolean>(note.completed)
  const [userId, setUserId] = useState<string>(note.user)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle('')
      setText('')
      setUserId('')
      navigate('/dash/notes')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)
  const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value)
  const onCompletedChanged = (e: React.ChangeEvent<HTMLInputElement>) => setCompleted(prev => !prev)

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onSaveNoteClicked = async () => {
    if (canSave) {
      await updateNote({ id: note.id, user: userId, title, text, completed })
    }
  }

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id })
  }

  const created: string = new Date(note.createdAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })

  const updated: string = new Date(note.updatedAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })

  const options = users.map(user => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    )
  })

  const errClass = isError || isDelError ? 'errmsg' : 'offscreen'
  const validTitleClass = !title ? 'form__input--incomplete' : ''
  const validTextClass = !text ? 'form__input--incomplete' : ''

  const errContent = ((error as any)?.data?.message || (delerror as any)?.data?.message) ?? ''

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.id}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="icon-button" title="Delete" onClick={onDeleteNoteClicked}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="note-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="note-text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <div className="form__row">
          <div className="form__divider">
            <label className="form__label form__checkbox-container" htmlFor="note-completed">
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>

            <label className="form__label form__checkbox-container" htmlFor="note-username">
              ASSIGNED TO:
            </label>
            <select
              id="note-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  )

  return content
}

export default EditNoteForm
