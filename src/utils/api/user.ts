import axios from "axios"
import { UserResponse } from "../../types/authenticate"
import { GetAllUserResponse } from "../../types/user"
import { apiLink } from "./link"

export const getAllUserApi = async (userId? : string) : Promise<GetAllUserResponse> =>{
    const url = apiLink.users.getAllUser
    try {
        const result = await axios.post<GetAllUserResponse>(url,{userId})
        return result.data
    } catch (error) {
        console.error(error);
        return{
            success:false,
            code:500
        }
    }
}

