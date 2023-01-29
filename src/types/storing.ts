import { Socket } from "socket.io-client";
import { User } from "./db";

export interface AuthSliceState  {
    isAuthenticated:boolean,
    user:User | null,
    isLoading:boolean,
    accessToken:string | null
}

export interface LocalSliceState{
    chatRoomSocket : Socket | null;
    isChatRoom:string | null
}

