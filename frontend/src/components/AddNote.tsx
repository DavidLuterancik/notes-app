import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Category, CategorySelect } from './CategorySelect'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { NoteProps } from './Note'
import { Close, Save } from '@mui/icons-material'
import moment from 'moment'
export interface NoteEditProps {
    id?: string
    title?: string
    description?: string
    category?: Category
    date?: string
    saveFunction?: (note: NoteProps) => void
    discardFunction?: () => void
}

export const NoteEdit: React.FC<NoteEditProps> = ({
    id,
    title,
    description,
    category,
    saveFunction,
    discardFunction,
}) => {
    const [t, setTitle] = useState<string>(title || '')
    const [d, setDescription] = useState<string>(description || '')
    const [c, setCategory] = useState<Category>(category || Category.New)
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)

    const titleLimit = Number(process.env.REACT_APP_NOTE_TITLE_LIMIT) || 20
    const descriptionLimit =
        Number(process.env.REACT_APP_NOTE_DESCRIPTION_LIMIT) || 200

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target

        if (titleLimit - value.length >= 0) {
            setTitle(value)
            setTitleError(value.trim() === '')
        }
    }

    function handleDescriptionChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const { value } = event.target

        if (descriptionLimit - value.length >= 0) {
            setDescription(value)
        } else {
            setDescription(value.slice(0, descriptionLimit))
        }

        setDescriptionError(value.trim() === '')
    }

    function handleCategorySelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = event.target

        setCategory(value as Category)
    }

    function validate() {
        let isValid = true

        if (t.trim() === '') {
            setTitleError(true)
            isValid = false
        }

        if (d.trim() === '') {
            setDescriptionError(true)
            isValid = false
        }

        return isValid
    }

    return (
        <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="column" spacing={1} justifyContent="center">
                    <TextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        value={t}
                        onChange={handleTitleChange}
                        required
                        error={titleError}
                        size={'small'}
                    />

                    <Typography fontSize={12} color="textSecondary" pb={2}>
                        Characters left: {`${titleLimit - t.length}`}
                    </Typography>

                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        maxRows={4}
                        value={d}
                        onChange={handleDescriptionChange}
                        required
                        error={descriptionError}
                        size={'small'}
                    />

                    <Typography fontSize={12} color="textSecondary" pb={2}>
                        Characters left: {`${descriptionLimit - d.length}`}
                    </Typography>

                    <CategorySelect
                        all={false}
                        selectedCategory={c}
                        selectFunction={handleCategorySelect}
                    />
                </Stack>
            </CardContent>

            <CardActions>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                        if (validate()) {
                            saveFunction &&
                                saveFunction({
                                    id: id || uuidv4(),
                                    title: t,
                                    description: d,
                                    category: c,
                                    date: moment().toISOString(),
                                })
                        }
                    }}
                    endIcon={<Save />}
                >
                    Save
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => discardFunction && discardFunction()}
                    endIcon={<Close />}
                >
                    Close
                </Button>
            </CardActions>
        </Card>
    )
}
