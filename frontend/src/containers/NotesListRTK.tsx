import React, { useEffect, useState } from 'react'

import { NoteProps } from '../components/Note'
import {
    Box,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import {
    Category,
    CategorySelect,
    categoryAll,
} from '../components/CategorySelect'
import AlertComponent, { AlertEnum, AlertItem } from '../components/Alert'
import { Sorter } from './NotesList'
import Notes from '../components/Notes'
import {
    useDeleteNoteMutation,
    useGetNotesQuery,
    usePostNoteMutation,
    usePutNoteMutation,
} from '../store/services/notes'

type editId = string | null

export default function NotesListRTK() {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [editId, setEditId] = useState<editId>(null)
    const [sorter, setSorter] = useState<Sorter>(Sorter.Newest)
    const [category, setCategory] = useState(categoryAll)

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(delayInputTimeoutId)
    }, [search])

    const {
        data: notes,
        error,
        isFetching,
    } = useGetNotesQuery({ q: debouncedSearch, category, sorter })

    const [postNote] = usePostNoteMutation()
    const [putNote] = usePutNoteMutation()
    const [deleteNote] = useDeleteNoteMutation()

    const [alert, setAlert] = useState<AlertItem | null>(null)

    function handleSaveNote(note: NoteProps) {
        if (note.id) {
            putNote(note)
                .unwrap()
                .then(() => handleShowAlert(AlertEnum.success))
                .catch(() => handleShowAlert(AlertEnum.error))
        } else {
            postNote(note)
                .unwrap()
                .then(() => handleShowAlert(AlertEnum.success))
                .catch(() => handleShowAlert(AlertEnum.error))
        }
        setEditId(null)
    }

    async function handleDeleteNote(note: NoteProps) {
        if (window.confirm(`Delete note ${note.title}?`)) {
            deleteNote(note)
                .unwrap()
                .then(() => handleShowAlert(AlertEnum.info))
                .catch(() => handleShowAlert(AlertEnum.error))
        }
    }

    function handleShowAlert(alert: AlertItem) {
        setAlert(alert)
    }

    function handleSelectEdit(id: editId) {
        setEditId(id)
    }

    function handleCategorySelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = event.target

        setCategory(value as Category)
    }

    function handleChangeSorter(sorter: Sorter) {
        setSorter(sorter)
    }

    return (
        <Box p={{ xs: 1, md: 2 }}>
            <AlertComponent alert={alert as AlertItem} />

            <Container maxWidth="lg">
                <Typography variant="h5" color="textPrimary" textAlign="center" gutterBottom>
                    Notes - RTK query
                </Typography>

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
                        notes={notes ?? []}
                        isFetching={isFetching}
                        error={error}
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
