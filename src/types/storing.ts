import { User } from "./db";

export interface AuthSliceState  {
    isAuthenticated:boolean,
    user:User | null,
    isLoading:boolean,
    accessToken:string | null
}

