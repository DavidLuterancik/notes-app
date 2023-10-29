import React, { useEffect, useState } from 'react'

import {
    Category,
    CategorySelect,
    categoryAll,
} from '../components/CategorySelect'
import { NoteProps } from '../components/Note'
import {
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Grid,
} from '@mui/material'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../store'
import {
    addReduxNote,
    editReduxNote,
    removeReduxNote,
    setReduxFilter,
    setReduxNotes,
} from '../store/features/notesSlice'
import AlertComponent, { AlertEnum, AlertItem } from '../components/Alert'
import Notes from '../components/Notes'

export enum Sorter {
    Newest = 'Newest',
    Oldest = 'Oldest',
}

const NotesList = () => {
    const [search, setSearch] = useState<string>('')
    const [editId, setEditId] = useState<string | null>(null)

    const dispatch = useAppDispatch()
    const { notes, filter } = useAppSelector((state) => state.notes)

    const [sorter, setSorter] = useState<Sorter>(filter.sorter as Sorter)
    const [category, setCategory] = useState<string>(filter.category)
    const [debouncedSearch, setDebouncedSearch] = useState<string>(
        filter.search
    )

    const [alert, setAlert] = useState<AlertItem>()
    const [, setShowAlert] = useState(false)

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(delayInputTimeoutId)
    }, [search])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/notes?${buildQuery()}`
                )
                dispatch(setReduxNotes(response.data))
            } catch (error) {
                console.error('Error fetching data:', error)
                handleShowAlert(AlertEnum.error)
            }
        }

        function buildQuery() {
            const searchParams = new URLSearchParams()

            if (debouncedSearch) {
                searchParams.append('q', debouncedSearch)
            }

            if (category !== categoryAll) {
                searchParams.append('category', category)
            }

            searchParams.append('_sort', 'date')
            searchParams.append(
                '_order',
                sorter === Sorter.Newest ? 'desc' : 'asc'
            )

            dispatch(
                setReduxFilter({
                    search: debouncedSearch,
                    category,
                    sorter,
                })
            )

            return searchParams.toString()
        }

        fetchData()
    }, [debouncedSearch, category, sorter, dispatch])

    function handleChangeSorter(sorter: Sorter) {
        setSorter(sorter)
    }

    function handleCategorySelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = event.target

        setCategory(value as Category)
    }

    async function handleSaveNote(note: NoteProps) {
        const noteIndex = notes.findIndex((n) => n.id === note.id)

        if (noteIndex === -1) {
            await postNote(note)
        } else {
            await putNote(noteIndex, note)
        }
    }

    async function postNote(note: NoteProps) {
        try {
            const { data: newNote } = await axios.post(
                `${process.env.REACT_APP_API_URL}/notes`,
                note
            )

            setEditId(null)
            dispatch(addReduxNote(newNote))
            handleShowAlert(AlertEnum.success)
        } catch (error) {
            console.error('Error post note:', error)
            handleShowAlert(AlertEnum.error)
        }
    }

    async function putNote(noteIndex: number, note: NoteProps) {
        try {
            const { data: updatedNote } = await axios.put(
                `${process.env.REACT_APP_API_URL}/notes/${note.id}`,
                note
            )

            setEditId(null)
            dispatch(editReduxNote({ noteIndex, note: updatedNote }))
            handleShowAlert(AlertEnum.success)
        } catch (error) {
            console.error('Error put note:', error)
            handleShowAlert(AlertEnum.error)
        }
    }

    async function handleDeleteNote(note: NoteProps) {
        if (window.confirm(`Delete note ${note.title}?`)) {
            try {
                const { status } = await axios.delete(
                    `${process.env.REACT_APP_API_URL}/notes/${note.id}`
                )

                if (status === 200) {
                    handleShowAlert(AlertEnum.info)
                    note.id && dispatch(removeReduxNote(note.id))
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                handleShowAlert(AlertEnum.error)
            }
        }
    }

    function handleSelectEdit(id: string | null) {
        setEditId(id)
    }

    function handleShowAlert(alert: AlertItem) {
        setAlert(alert)
        setShowAlert(true)

        setTimeout(() => {
            setShowAlert(false)
        }, alert.duration)
    }

    return (
        <Box p={{ xs: 1, md: 2 }}>
            <AlertComponent alert={alert as AlertItem} />

            <Container maxWidth="sm">
            <Typography variant="h5" color="textPrimary" textAlign="center" gutterBottom>
                    Notes - Redux + Axios
                </Typography>

                {/* <Typography
                    fontSize={16}
                    color="textSecondary"
                    textAlign="justify"
                    paragraph
                    lineHeight={1.5}
                    pb={2}
                >
                    Find notes quickly with the dynamic search feature and
                    maintain brevity with a character limit. Filter them on
                    need. A versatile solution for efficient digital note
                    management. Keep focus on clean and maintainable code.
                </Typography> */}

                <TextField
                    id="search"
                    label="Search"
                    value={search}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSearch(event.target.value)
                    }}
                    fullWidth
                    sx={{
                        background: 'white',
                    }}
                />

                <Stack
                    sx={{ py: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    <CategorySelect
                        all={true}
                        selectedCategory={category as Category}
                        selectFunction={handleCategorySelect}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="sorter-select-label">Sorter</InputLabel>
                        <Select
                            labelId="sorter-select-label"
                            id="sorter-select"
                            value={sorter}
                            label="Sorter"
                            onChange={(e) =>
                                handleChangeSorter(e.target.value as Sorter)
                            }
                            sx={{
                                background: 'white',
                            }}
                        >
                            {Object.values(Sorter).map((sorter) => (
                                <MenuItem key={sorter} value={sorter}>
                                    {sorter}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Container>

            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Notes
                        notes={notes}
                        error={false}
                        isFetching={false}
                        editId={editId}
                        handleSelectEdit={handleSelectEdit}
                        handleDeleteNote={handleDeleteNote}
                        handleSaveNote={handleSaveNote}
                    />
                </Grid>
            </Container>
        </Box>
    )
}

export default NotesList
