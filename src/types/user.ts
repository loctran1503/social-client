import { DefaultResponse } from ".";
import { User } from "./db";

export interface UserFindAround{
    userId:string,
          avatar:string,
          isOnline:boolean,
          name:string
}

export interface GetAllUserResponse extends DefaultResponse{
    userList?:UserFindAround[]
}