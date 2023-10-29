import { configureStore } from '@reduxjs/toolkit'
import { NotesSlice } from './store/features/notesSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { notesApi } from './store/services/notes'

export const store = configureStore({
    reducer: {
        notes: NotesSlice.reducer,
        [notesApi.reducerPath]: notesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(notesApi.middleware),
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<
    ReturnType<typeof store.getState>
> = useSelector

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
