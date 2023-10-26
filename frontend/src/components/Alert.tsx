import React from 'react'
import { Alert, Box, Fade } from '@mui/material'


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

export type AlertItem = {
    severity: any
    text: string
    duration: number
}

export interface AlertProps {
    showAlert: boolean
    alert: AlertItem
}

const AlertComponent: React.FC<AlertProps> = ({ showAlert, alert }) => {
    return (
        <Box sx={{ position: 'absolute' }}>
            <Fade in={showAlert}>
                <Alert severity={alert?.severity}>{alert?.text}</Alert>
            </Fade>
        </Box>
    )
}

export default AlertComponent
