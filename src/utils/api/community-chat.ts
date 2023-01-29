import axios from "axios";
import { MessageResponse } from "../../types/chat";
import { apiLink } from "./link";



export const getCommunityMessageApi =async (timestamp? : Date) : Promise<MessageResponse> =>{
    try {

       const url = apiLink.messages.findAll
      
       
       const result = await axios.post<MessageResponse>(url,timestamp && {
        timestamp
       })
       return result.data
    } catch (error) {
        return{
            code:500,
            success:false,
            message:JSON.stringify(error)
        }
        
    }
}