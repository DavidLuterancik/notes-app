import {
    Button,
    Card,
    CardActions,
    CardContent,
    Stack,
    Typography,
} from '@mui/material'
import moment from 'moment'
import React from 'react'

export interface NoteProps {
    id: string
    title: string
    description: string
    category: string
    date: Date
    deleteFunction?: Function
}

export const Note: React.FC<NoteProps> = (props) => {
    const { id, title, description, category, date, deleteFunction } = props

    return (
        <Card>
            <CardContent>
                <Stack direction="column" spacing={2} justifyContent="center">
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>

                    <Typography variant="h6" component="h3">
                        {description}
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Typography>{category}</Typography>

                        <Typography>
                            {moment(date).format('DD.MM.YYYY HH:mm:ss')}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => deleteFunction && deleteFunction(props)}
                >
                    Delete note
                </Button>
            </CardActions>
        </Card>
    )
}
