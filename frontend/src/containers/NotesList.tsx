import React, { useState } from 'react'

import {
    Category,
    CategorySelect,
    categoryAll,
} from '../components/CategorySelect'
import { Note, NoteProps } from '../components/Note'
import moment from 'moment'
import { NoteEdit } from '../components/AddNote'
import {
    Box,
    Button,
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

export enum Sorter {
    Newest = 'newest',
    Oldest = 'oldest',
}

const NotesList = () => {
    const [notes, setNotes] = useState<NoteProps[]>([
        {
            id: 'prim',
            title: 'Prvá',
            description: 'description',
            category: Category.New,
            date: new Date('2023-10-24T00:00:00'),
        },
        {
            id: 'prim2',
            title: 'Druhá 2',
            description: 'description 2',
            category: Category.InProgress,
            date: new Date('2022-10-24T00:00:00'),
        },
    ])
    const [sorter, setSorter] = useState<Sorter>(Sorter.Newest)
    const [category, setCategory] = useState<string>(categoryAll)
    const [search, setSearch] = useState<string>('')
    const [addNote, setAddNote] = useState<Boolean>(false)

    function handleChangeSorter(sorter: Sorter) {
        setSorter(sorter)
    }

    function handleCategorySelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = event.target

        setCategory(value as Category)
    }

    function getSearchFilter(note: NoteProps) {
        return (
            note.title?.toLowerCase().includes(search.toLowerCase()) ||
            note.description?.toLowerCase().includes(search.toLowerCase())
        )
    }

    function getCategoryFilter(note: NoteProps) {
        if (category === categoryAll) return true
        return note.category === category
    }

    function getSorter(a: NoteProps, b: NoteProps) {
        return sorter === Sorter.Newest
            ? moment(b.date).diff(a.date)
            : moment(a.date).diff(b.date)
    }

    const sortedNotes = notes
        .filter((note) => getSearchFilter(note))
        .filter((note) => getCategoryFilter(note))
        .sort((a, b) => getSorter(a, b))

    function handleSaveNote(note: NoteProps) {
        setNotes([...notes, note])
        setAddNote(false)
    }

    function handleDiscardNote() {
        setAddNote(false)
    }

    function handleDeleteNote(note: NoteProps) {
        if (window.confirm(`Delete note ${note.title}?`)) {
            setNotes(notes.filter((n) => n.id !== note.id))
        }
    }

    return (
        <Box>
            <Container>
                <Typography
                    component="h1"
                    variant="h2"
                    color="text.primary"
                    gutterBottom
                >
                    Notes
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
                                <MenuItem value={sorter}>{sorter}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Container>

            <Container sx={{ pt: 4 }}>
                <Grid container>
                    {sortedNotes.map((note) => (
                        <Grid>
                            <Note
                                key={note.id}
                                {...note}
                                deleteFunction={(note: NoteProps) =>
                                    handleDeleteNote(note)
                                }
                            />
                        </Grid>
                    ))}

                    <Grid>
                        {addNote ? (
                            <NoteEdit
                                saveFunction={(note: NoteProps) =>
                                    handleSaveNote(note)
                                }
                                discardFunction={() => handleDiscardNote()}
                            />
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => setAddNote(true)}
                            >
                                Add note
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default NotesList
