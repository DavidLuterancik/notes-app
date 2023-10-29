import React from 'react'

import NoteSkeleton, { Note, NoteProps } from '../components/Note'
import { Button, Grid } from '@mui/material'
import { NoteEdit } from '../components/AddNote'
import { Category } from '../components/CategorySelect'
import { Add } from '@mui/icons-material'

interface NotesComponentProps {
    notes: NoteProps[]
    error: any
    isFetching: boolean
    editId: string | null
    handleSelectEdit: (editId: string | null) => void
    handleDeleteNote: (note: NoteProps) => void
    handleSaveNote: (note: NoteProps) => void
}

const Notes: React.FC<NotesComponentProps> = ({
    notes,
    error,
    isFetching,
    editId,
    handleSelectEdit,
    handleDeleteNote,
    handleSaveNote,
}) => {
    if (error) return <div>An error has occurred!</div>

    if (isFetching)
        return (
            <>
                {Array.from(Array(4).keys()).map((s) => (
                    <Grid item key={s} xs={12} sm={6} md={4} lg={3}>
                        <NoteSkeleton />
                    </Grid>
                ))}
            </>
        )

    return (
        <>
            {notes?.map((note) => (
                <Grid item key={note.id} xs={12} sm={6} md={4} lg={3}>
                    {editId === note.id ? (
                        <NoteEdit
                            {...note}
                            category={note.category as Category}
                            saveFunction={(note: NoteProps) =>
                                handleSaveNote(note)
                            }
                            discardFunction={() => handleSelectEdit(null)}
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
                        id={null}
                        saveFunction={(note: NoteProps) => handleSaveNote(note)}
                        discardFunction={() => handleSelectEdit(null)}
                    />
                ) : (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleSelectEdit('add')}
                        endIcon={<Add />}
                        fullWidth
                        sx={{
                            height: '100%',
                            minHeight: '300px',
                        }}
                    >
                        Add note
                    </Button>
                )}
            </Grid>
        </>
    )
}

export default Notes
