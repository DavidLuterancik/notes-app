import React, { useEffect, useState } from 'react'
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
    alert: AlertItem
}

const AlertComponent: React.FC<AlertProps> = ({ alert }) => {
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        if (alert?.duration) {
            setShowAlert(true)

            let timer1 = setTimeout(() => {
                setShowAlert(false)
            }, alert?.duration)

            return () => {
                clearTimeout(timer1)
            }
        }
    }, [alert])

    return (
        <Box sx={{ position: 'absolute' }}>
            <Fade in={showAlert}>
                <Alert severity={alert?.severity} variant="filled">
                    {alert?.text}
                </Alert>
            </Fade>
        </Box>
    )
}

export default AlertComponent
