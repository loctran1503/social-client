import { DefaultResponse } from "."
import { CommunityMedia } from "./chat-room"

export interface MessageResponse extends DefaultResponse{
    messageList?:MessageIO[],
    hasMore?:boolean
}

export interface CreateCommunityMessage{
    content:string,
    media?:MediaDto
}

export interface MediaDto{
    originalname: string,
    mimetype: string,
    size:number,
    buffer:File
  }



export interface MessageIO extends DefaultResponse{
    content?:string,
    timestamp?:Date,
    messageId?:string,
    media?:CommunityMedia
    user?:{
        userId:string
        name:string,
        avatar:string
    },
    timestampBlocking?:number

}