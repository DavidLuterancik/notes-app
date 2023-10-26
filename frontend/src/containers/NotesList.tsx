import React, { useEffect, useState } from 'react'

import {
    Category,
    CategorySelect,
    categoryAll,
} from '../components/CategorySelect'
import { Note, NoteProps } from '../components/Note'
import { NoteEdit } from '../components/AddNote'

import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Grid,
    Alert,
    CircularProgress,
    Fade,
} from '@mui/material'
import axios from 'axios'
import { Add } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../store'
import {
    addReduxNote,
    editReduxNote,
    removeReduxNote,
    setReduxFilter,
    setReduxNotes,
} from '../store/features/notesSlice'

export enum Sorter {
    Newest = 'Newest',
    Oldest = 'Oldest',
}

export const AlertEnum: Record<string, AlertItem> = {
    error: {
        severity: 'error',
        text: 'Oops, something went wrong',
        duration: 8000,
    },
    success: {
        severity: 'success',
        text: 'Successfully saved',
        duration: 4000,
    },
    info: {
        severity: 'info',
        text: 'Note deleted',
        duration: 4000,
    },
}

type AlertItem = {
    severity: any
    text: string
    duration: number
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

    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<AlertItem>()
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(delayInputTimeoutId)
    }, [search])

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/?${buildQuery()}`
                )
                setLoading(false)
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
                `${process.env.REACT_APP_API_URL}`,
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
                `${process.env.REACT_APP_API_URL}/${note.id}`,
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
                    `${process.env.REACT_APP_API_URL}/${note.id}`
                )

                if (status === 200) {
                    handleShowAlert(AlertEnum.info)
                    dispatch(removeReduxNote(note.id))
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                handleShowAlert(AlertEnum.error)
            }
        }
    }

    function handleSelectEdit(id: string) {
        setEditId(id)
    }

    function handleDiscardEdit() {
        setEditId(null)
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
            <Box sx={{ position: 'absolute', right: 16 }}>
                <Fade in={loading}>
                    <CircularProgress />
                </Fade>
            </Box>
            <Box sx={{ position: 'absolute' }}>
                <Fade in={showAlert}>
                    <Alert severity={alert?.severity}>{alert?.text}</Alert>
                </Fade>
            </Box>

            <Container maxWidth="sm">
                <Typography variant="h2" color="textPrimary" textAlign="center">
                    Notes
                </Typography>

                <Typography
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
                </Typography>

                <TextField
                    id="search"
                    label="Search"
                    value={search}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSearch(event.target.value)
                    }}
                    fullWidth
                    style={{
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
                            style={{
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
                    {renderNotes()}
                </Grid>
            </Container>
        </Box>
    )

    function renderNotes() {
        return (
            <>
                {notes.map((note) => (
                    <Grid item key={note.id} xs={12} sm={6} md={4} lg={3}>
                        {editId === note.id ? (
                            <NoteEdit
                                {...note}
                                category={note.category as Category}
                                saveFunction={(note: NoteProps) =>
                                    handleSaveNote(note)
                                }
                                discardFunction={() => handleDiscardEdit()}
                            />
                        ) : (
                            <Note
                                {...note}
                                selectEditFunction={(note: NoteProps) =>
                                    handleSelectEdit(note.id)
                                }
                                deleteFunction={(note: NoteProps) =>
                                    handleDeleteNote(note)
                                }
                            />
                        )}
                    </Grid>
                ))}

                <Grid item key={'add'} xs={12} sm={6} md={4} lg={3}>
                    {editId === 'add' ? (
                        <NoteEdit
                            saveFunction={(note: NoteProps) =>
                                handleSaveNote(note)
                            }
                            discardFunction={() => handleDiscardEdit()}
                        />
                    ) : (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => handleSelectEdit('add')}
                            endIcon={<Add />}
                            fullWidth
                            sx={{height: '100%', minHeight: '300px'}}
                        >
                            Add note
                        </Button>
                    )}
                </Grid>
            </>
        )
    }
}

export default NotesList
