import React, { useState } from 'react'
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

export interface NoteEditProps {
    title?: string
    description?: string
    category?: Category
    saveFunction: Function
    discardFunction: Function
}

export const NoteEdit: React.FC<NoteEditProps> = ({
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

    const titleLimit = 10
    const descriptionLimit = 200

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        if (titleLimit - value.length >= 0) {
            setTitle(value)
            setTitleError(value.trim() === '')
        }
    }

    function handleDescriptionChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = event.target

        if (descriptionLimit - value.length >= 0) {
            setDescription(value)
            setDescriptionError(value.trim() === '')
        }
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
        <Card>
            <CardContent>
                <Stack direction="column" spacing={2} justifyContent="center">
                    <TextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        value={t}
                        onChange={handleTitleChange}
                        required
                        error={titleError}
                    />

                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        maxRows={4}
                        value={d}
                        onChange={handleDescriptionChange}
                        required
                        error={descriptionError}
                    />

                    <Typography>
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
                            saveFunction({
                                id: new Date(),
                                title: t,
                                description: d,
                                category: c,
                                date: new Date(),
                            })
                        }
                    }}
                >
                    Save note
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => discardFunction()}
                >
                    Discard changes
                </Button>
            </CardActions>
        </Card>
    )
}
