/* eslint-disable camelcase */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../Components/axiosInstance';
import { ApiServices } from '../../Services/ApiServices';

export const projectsSlice = createSlice(
    {
        name: 'projects',
        initialState: {
            projectId: {},
            createWorkItem: false,
            projectUsers: [],
            addedToProject: null,
        },
        reducers: {
            setProjectId: (state, action) => {
                state.projectId = action.payload;
            },
            setcreateWorkItem: (state, action) => {
                state.createWorkItem = action.payload;
            }, setProjectUsers: (state, action) => {
                state.projectUsers = action.payload;
            },
            setAddedToProject: (state, action) => {
                state.addedToProject = action.payload;
            },
            
        }
    });


export const { setProjectId, setcreateWorkItem, setProjectUsers, setAddedToProject } = projectsSlice.actions;

// this is for configureStore
export default projectsSlice.reducer;
