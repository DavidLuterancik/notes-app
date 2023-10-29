import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { NoteProps } from '../../components/Note'
import { categoryAll } from '../../components/CategorySelect'
import { Sorter } from '../../containers/NotesList'

type notesQuery = {
    q: string
    category: string
    sorter: string
}

export const notesApi = createApi({
    reducerPath: 'notesApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_API_URL}` }),
    tagTypes: ['Note'],
    endpoints: (builder) => ({
        getNotes: builder.query<NoteProps[], notesQuery>({
            query: (params) => {
                return `/notes?${buildQuery(params)}`
            },
            providesTags: ['Note'],
        }),
        postNote: builder.mutation<void, NoteProps>({
            query: (note) => ({
                url: '/notes',
                method: 'POST',
                body: note,
            }),
            invalidatesTags: ['Note'],
        }),
        putNote: builder.mutation<void, NoteProps>({
            query: ({ id, ...rest }) => ({
                url: `/notes/${id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: ['Note'],
        }),
        deleteNote: builder.mutation<void, NoteProps>({
            query: ({ id }) => ({
                url: `/notes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Note'],
        }),
    }),
})

function buildQuery({ q, category, sorter }: notesQuery) {
    const searchParams = new URLSearchParams()

    if (q) {
        searchParams.append('q', q)
    }

    if (category !== categoryAll) {
        searchParams.append('category', category)
    }

    searchParams.append('_sort', 'date')
    searchParams.append('_order', sorter === Sorter.Newest ? 'desc' : 'asc')

    return searchParams.toString()
}

export const {
    useGetNotesQuery,
    usePostNoteMutation,
    usePutNoteMutation,
    useDeleteNoteMutation,
} = notesApi
