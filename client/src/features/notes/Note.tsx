import React, { memo } from 'react'
import { EntityId } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { useGetNotesQuery } from './notesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

type PropsType = {
  noteId: EntityId
}

const Note = ({ noteId }: PropsType) => {
  const { note } = useGetNotesQuery('notesList', {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId]
    })
  })

  const navigate = useNavigate()

  if (note) {
    const created = new Date(note.createdAt).toLocaleString('en-VN', {
      day: 'numeric',
      month: 'long'
    })

    const updated = new Date(note.updatedAt).toLocaleString('en-VN', {
      day: 'numeric',
      month: 'long'
    })

    const handleEdit = () => navigate(`/dash/notes/${noteId}`)

    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )
  } else return <></>
}

const memorizedNote = memo(Note)

export default memorizedNote
