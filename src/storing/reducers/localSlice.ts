import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { LoginByPassWord, SignUpByPassword } from "../../types/authenticate";
import { User } from "../../types/db";
import { AuthSliceState, LocalSliceState } from "../../types/storing";
import { checkAuthenticateApi, loginApi, logoutApi, signUpApi } from "../../utils/api/authenticate";


const initialState : LocalSliceState = {
    chatRoomSocket:null,
    isChatRoom:null
}

const localSlice = createSlice({
    name:'localSlice',
    initialState,
    reducers:{
      setChatRoomSocket(state,action){
        state.chatRoomSocket = action.payload 
      },
      setIsChatRoom(state,action){
        state.isChatRoom = action.payload 
      }
    },
    extraReducers:(builder) =>{
    }
})

const localReducer = localSlice.reducer;
export const localSelector = (state: RootState) => state.local;
export const { setChatRoomSocket,setIsChatRoom} =
localSlice.actions;

export default localReducer;