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
    Card,
    CardContent,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { Add } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../store'
import {
    addReduxNote,
    removeReduxNote,
    setReduxNotes,
} from '../store/features/notesSlice'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

export enum Sorter {
    Newest = 'Newest',
    Oldest = 'Oldest',
}

const NotesList = () => {
    const [notes, setNotes] = useState<NoteProps[]>([])
    const [sorter, setSorter] = useState<Sorter>(Sorter.Newest)
    const [category, setCategory] = useState<string>(categoryAll)
    const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState<string>('')
    const [editId, setEditId] = useState<string | null>(null)

    const dispatch = useAppDispatch()
    const reduxNotes = useAppSelector((state) => state.notes)
    const [reduxToggle, setReduxToggle] = useState(false)

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
                    `${process.env.REACT_APP_API_URL}/?${buildQuery()}`
                )
                setNotes(response.data)
                dispatch(setReduxNotes(response.data))
            } catch (error) {
                console.error('Error fetching data:', error)
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

    // Frontend filtering

    // function getSearchFilter(note: NoteProps) {
    //     return (
    //         note.title?.toLowerCase().includes(search.toLowerCase()) ||
    //         note.description?.toLowerCase().includes(search.toLowerCase())
    //     )
    // }

    // function getCategoryFilter(note: NoteProps) {
    //     if (category === categoryAll) return true
    //     return note.category === category
    // }

    // function getSorter(a: NoteProps, b: NoteProps) {
    //     return sorter === Sorter.Newest
    //         ? moment(b.date).diff(a.date)
    //         : moment(a.date).diff(b.date)
    // }

    // const sortedNotes = notes
    //     .filter((note) => getSearchFilter(note))
    //     .filter((note) => getCategoryFilter(note))
    //     .sort((a, b) => getSorter(a, b))

    async function handleSaveNote(note: NoteProps) {
        const existingNoteIndex = notes.findIndex((n) => n.id === note.id)

        if (existingNoteIndex === -1) {
            await postNote(note)
        } else {
            await putNote(existingNoteIndex, note)
        }
    }

    async function postNote(note: NoteProps) {
        try {
            const { data: newNote } = await axios.post(
                `${process.env.REACT_APP_API_URL}`,
                note
            )
            setNotes([...notes, newNote])
            setEditId(null)
        } catch (e) {
            console.error(e)
        }
    }

    async function putNote(existingNoteIndex: number, note: NoteProps) {
        try {
            const { data: updatedNote } = await axios.put(
                `${process.env.REACT_APP_API_URL}/${note.id}`,
                note
            )

            const updatedNotes = [...notes]
            updatedNotes[existingNoteIndex] = updatedNote
            setNotes(updatedNotes)
            setEditId(null)
        } catch (e) {
            console.error(e)
        }
    }

    async function handleDeleteNote(note: NoteProps) {
        if (window.confirm(`Delete note ${note.title}?`)) {
            try {
                const { status } = await axios.delete(
                    `${process.env.REACT_APP_API_URL}/${note.id}`
                )

                if (status === 200) {
                    setNotes(notes.filter((n) => n.id !== note.id))
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

    function handleSelectEdit(id: string) {
        setEditId(id)
    }

    function handleDiscardEdit() {
        setEditId(null)
    }

    function renderReduxToggle() {
        return (
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={reduxToggle} />}
                    label="Redux state demo"
                    onChange={() => {
                        setReduxToggle(!reduxToggle)
                    }}
                />
            </FormGroup>
        )
    }

    if (reduxToggle) {
        return (
            <Box>
                <Container maxWidth="lg">
                    {reduxNotes.notes.map((n) => (
                        <Note
                            key={n.id}
                            {...n}
                            deleteFunction={(note) => {
                                dispatch(removeReduxNote(note.id))
                            }}
                        />
                    ))}

                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<Add />}
                        onClick={() =>
                            dispatch(
                                addReduxNote({
                                    id: uuidv4(),
                                    title: 'test',
                                    description: 'test',
                                    category: 'new',
                                    date: moment().toString(),
                                })
                            )
                        }
                    >
                        Add to store
                    </Button>

                    {renderReduxToggle()}
                </Container>
            </Box>
        )
    }

    function renderAddNote() {
        return (
            <Grid item key={'add'} xs={12} sm={6} md={4} lg={3}>
                {editId === 'add' ? (
                    <NoteEdit
                        saveFunction={(note: NoteProps) => handleSaveNote(note)}
                        discardFunction={() => handleDiscardEdit()}
                    />
                ) : (
                    <Card>
                        <CardContent>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => handleSelectEdit('add')}
                                endIcon={<Add />}
                            >
                                Add note
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Grid>
        )
    }

    return (
        <Box>
            <Container maxWidth="lg">
                <Typography variant="h1" color="textPrimary" textAlign="center">
                    Notes
                </Typography>

                <Typography
                    variant="h6"
                    color="textSecondary"
                    textAlign="center"
                    paragraph
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
                />

                <Stack
                    sx={{ pt: 4 }}
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
                <Grid
                    container
                    spacing={2}
                    justifyContent="flex-start"
                    padding={'20px 0'}
                >
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

                    {renderAddNote()}
                </Grid>

                {renderReduxToggle()}
            </Container>
        </Box>
    )
}

export default NotesList
