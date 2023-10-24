import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

export const categoryAll = 'all'

export enum Category {
    New = 'new',
    InProgress = 'inProgress',
    Completed = 'completed',
    Archived = 'archived',
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
            >
                {all && <MenuItem value={categoryAll}>{categoryAll}</MenuItem>}
                {Object.values(Category).map((category) => (
                    <MenuItem value={category}>{category}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
