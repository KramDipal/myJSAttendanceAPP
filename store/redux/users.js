import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";


// Thunks
export const fetchPosts = createAsyncThunk(
    'users/fetchPosts',
    async (arg, thunkAPI) => {
      const request = await axios.get('https://jsonplaceholder.typicode.com/photos?_limit=10');
      const response = request.data;

    //   console.log(response);
      return response;
    }
  );

const usersSlice = createSlice({
    name:'users',
    initialState:{
        appName:'Awesome App',
        appVersion: '20.0',
        users:[],
        posts:[],
        loading:false
    },
    reducers:{
        changeAppName:(state, action)=>{
            state.appName = action.payload;
        },
        changeAppVersion:(state, action)=>{
            state.appVersion = action.payload;
        },
        setNewUser:(state, action)=>{
            // state.users.push(action.payload);
            state.users = [...state.users, action.payload];
        },
        removeName:(state, action)=>{
             state.users.splice(action.payload, 1);
            //state.users = state.users.filter((_, index) => index!==action.payload);
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchPosts.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchPosts.fulfilled,(state,action)=>{
            state.posts = action.payload;
            state.loading = false;
        })
        .addCase(fetchPosts.rejected,(state,action)=>{
            state.loading = false;
            console.log(error)
        })
    }
});

export const { changeAppName, setNewUser, removeName, changeAppVersion } = usersSlice.actions;
export default usersSlice.reducer;