import axios from "axios";
import { DefaultResponse } from "../../types";
import { GetAllChatRoomResponse, GetChatRoomResponse } from "../../types/chat-room";
import { User } from "../../types/db";
import { apiLink } from "./link";

export const getChatRoomApi = async (userId : string) : Promise<GetChatRoomResponse>  =>{
    const url = apiLink.chatsRoom.getOne
    try {
        const result = await axios.post<GetChatRoomResponse>(url,{userId})
        return result.data
    } catch (error) {
        console.error(error);
        return{
            success:false,
            code:500
        }
    }
}

export const getAllChatRoomApi = async () : Promise<GetAllChatRoomResponse>  =>{
    const url = apiLink.chatsRoom.getAll
    try {
        const result = await axios.post<GetAllChatRoomResponse>(url)
        return result.data
    } catch (error) {
        console.error(error);
        return{
            success:false,
            code:500
        }
    }
}

export const setIsSeenApi = async (receiver : User)  : Promise<DefaultResponse> =>{
    try {
        const url = apiLink.chatsRoom.setIsSeen
        const result = await axios.post<DefaultResponse>(url,{
            receiver
        })
   
        
        return result.data
    } catch (error) {
        console.error(error);
        return{
            success:false,
            code:500
        }
    }
}