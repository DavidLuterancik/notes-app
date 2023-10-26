import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

export const categoryAll = 'All'

export enum Category {
    New = 'New',
    InProgress = 'In progress',
    Completed = 'Completed',
    Archived = 'Archived',
}

export interface CategorySelectProps {
    all: boolean
    selectedCategory: Category
    selectFunction: Function
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
    all,
    selectedCategory,
    selectFunction,
}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Age"
                onChange={(e) => selectFunction(e)}
                style={{
                    background: 'white'
                }}
            >
                {all && <MenuItem value={categoryAll}>{categoryAll}</MenuItem>}
                {Object.values(Category).map((category) => (
                    <MenuItem key={category} value={category}>
                        {category}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
