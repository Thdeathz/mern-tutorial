import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { apiSlice } from '~/app/api/apiSlice'
import { RootState } from '~/app/store'

export interface Note {
  id: string
  user: string
  username: string
  title: string
  text: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

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
        validateStatus: (response: Response, result: any) =>
          response.status === 200 && !result.isError
      }),
      transformResponse: (responseData: (Note & { _id: string })[]) => {
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
    }),
    addNewNote: builder.mutation({
      query: (initialNote: Pick<Note, 'user' | 'title' | 'text'>) => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...initialNote
        }
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }]
    }),
    updateNote: builder.mutation({
      query: (initialNote: Omit<Note, 'username' | 'createdAt' | 'updatedAt'>) => ({
        url: '/notes',
        method: 'PATCH',
        body: {
          ...initialNote
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }]
    }),
    deleteNote: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/notes',
        method: 'DELETE',
        body: {
          id
        }
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }]
    })
  })
})

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = notesApiSlice

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
