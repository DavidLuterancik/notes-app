import { Delete, Edit } from '@mui/icons-material'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Stack,
    Typography,
    colors,
} from '@mui/material'
import moment from 'moment'
import React from 'react'
import { Category } from './CategorySelect'

export interface NoteProps {
    id: string
    title: string
    description: string
    category: string
    date: string
    deleteFunction?: (note: NoteProps) => void
    selectEditFunction?: (note: NoteProps) => void
}

export const Note: React.FC<NoteProps> = (props) => {
    const {
        title,
        description,
        category,
        date,
        selectEditFunction,
        deleteFunction,
    } = props

    function getBackgroundColor(category: Category) {
        switch (category) {
            case Category.InProgress:
                return colors.blue[100]
            case Category.Completed:
                return colors.green[100]
            case Category.Archived:
                return colors.grey[300]
            default:
                return colors.grey[50]
        }
    }

    return (
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                background: getBackgroundColor(category as Category),
            }}
        >
            <CardContent>
                <Stack direction="column" spacing={2} justifyContent="center">
                    <Typography variant="h5" fontWeight={'bold'}>
                        {title}
                    </Typography>

                    <Typography fontSize={14}>{description}</Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                    >
                        <Typography fontSize={12} color={'textSecondary'}>
                            {category}
                        </Typography>

                        <Typography fontSize={12} color={'textSecondary'}>
                            {moment(date).format('DD.MM.YYYY HH:mm:ss')}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                        selectEditFunction && selectEditFunction(props)
                    }
                    endIcon={<Edit />}
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => deleteFunction && deleteFunction(props)}
                    endIcon={<Delete />}
                    color="error"
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    )
}
