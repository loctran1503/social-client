import { DefaultResponse } from "."
import { User } from "./db"

//Request
export interface LoginByPassWord{
    email:string,
    password:string
}

export interface SignUpByPassword{
    email:string,
    password:string,
    name:string,
    gender:string
}

// Response
export interface UserResponse extends DefaultResponse{
    accessToken?:string
    user?:User
}

