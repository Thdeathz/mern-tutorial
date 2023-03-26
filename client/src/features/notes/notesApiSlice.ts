import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '~/app/api/apiSlice'
import { RootState } from '~/app/store'

export interface Note {
  id: string
  user: string
  username: string
  title: string
  text: string
  completed: string
  createdAt: string
  updatedAt: string
}

type ResponseData = Note & { _id: string }

const notesApdapter = createEntityAdapter<Note>({
  sortComparer: (a, b) =>
    a.completed === b.completed ? b.createdAt.localeCompare(a.createdAt) : a.completed ? 1 : -1
})

const initialState = notesApdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotes: builder.query({
      query: () => ({
        url: '/notes',
        validateStatus: (response, result) => response.status === 200 && !result.isError
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData: ResponseData[]) => {
        const loaderNotes: Note[] = responseData.map(note => {
          note.id = note._id
          return note as Note
        })

        return notesApdapter.setAll(initialState, loaderNotes)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Note', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Note' as const, id }))
          ]
        } else return [{ type: 'Note', id: 'LIST' }]
      }
    })
  })
})

export const { useGetNotesQuery } = notesApiSlice

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select([])

const selectNotesData = createSelector(
  selectNotesResult,
  notesResult => notesResult.data as NonNullable<typeof notesResult.data>
)

export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds
} = notesApdapter.getSelectors((state: RootState) => selectNotesData(state) ?? initialState)
