import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { LoginByPassWord, SignUpByPassword } from "../../types/authenticate";
import { User } from "../../types/db";
import { AuthSliceState } from "../../types/storing";
import { checkAuthenticateApi, loginApi, logoutApi, signUpApi } from "../../utils/api/authenticate";


const initialState : AuthSliceState = {
    isAuthenticated:false,
    user:null,
    isLoading:true,
    accessToken:null
}


//Check authenticate
export const checkAuthenticate = createAsyncThunk('checkAuth',async ()  =>{
  return await checkAuthenticateApi()
})

//User Sign up
export const userSignup = createAsyncThunk('userSignup',async (dto : SignUpByPassword)   =>{
  return  await signUpApi(dto)

})

//User login
export const userLogin = createAsyncThunk('userLogin',async (dto : LoginByPassWord)  =>{
  return await loginApi(dto)
})

//User logout
export const userLogout = createAsyncThunk('userLogout',async ()  =>{
  return await logoutApi()
})





const authSlice = createSlice({
    name:'authSlice',
    initialState,
    reducers:{
      setIsLoading(state,action){
        state.isLoading = action.payload 
      },
    },
    extraReducers:(builder) =>{
      //************************************************************************************************************* */
      // Check Authenticate Case
      //************************************************************************************************************* */
      builder.addCase(checkAuthenticate.pending,(state) =>{
  
      });
      builder.addCase(checkAuthenticate.fulfilled,(state,action ) =>{
        state.isLoading=false
        if(action.payload.success && action.payload.user && action.payload.accessToken){
     
          
          state.isAuthenticated = true;
          state.user = action.payload.user as User
        state.accessToken = action.payload.accessToken
        }else{
          console.log(action.payload.message)
        }
       
      });
   
      //************************************************************************************************************* */
      // Sign Up Case
      //************************************************************************************************************* */
      builder.addCase(userSignup.pending,(state) =>{
        
      });
      builder.addCase(userSignup.fulfilled,(state,action ) =>{
        if(action.payload.success && action.payload.user && action.payload.accessToken){
          state.isAuthenticated = true;
          state.user = action.payload.user as User
          state.accessToken = action.payload.accessToken
        }else{
          console.log(action.payload.message)
        }
      });
      //************************************************************************************************************* */
      // Log In Case
      //************************************************************************************************************* */
      builder.addCase(userLogin.pending,(state) =>{

      });
      builder.addCase(userLogin.fulfilled,(state,action ) =>{
        
        
        
        if(action.payload.success && action.payload.user && action.payload.accessToken){
          
          
          state.isAuthenticated = true;
          state.user = action.payload.user as User
          state.accessToken = action.payload.accessToken
        }
      });
      //************************************************************************************************************* */
       // Log Out Case
       //************************************************************************************************************* */
       builder.addCase(userLogout.pending,(state) =>{
        state.isLoading=true
      });
      builder.addCase(userLogout.fulfilled,(state,action ) =>{
        state.isLoading=false
        if(action.payload.success){
          state.isAuthenticated = false;
          state.user = null
        }
      });
       
        
  
    
    }
})

const authReducer = authSlice.reducer;
export const authSelector = (state: RootState) => state.auth;
export const { setIsLoading} =
  authSlice.actions;

export default authReducer;