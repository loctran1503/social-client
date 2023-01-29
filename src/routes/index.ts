import { MemoExoticComponent, ReactNode } from "react";
import HomePage from "../components/HomePage/homepage.index";
import AllUser from "../components/Navbar/AllUser/all-user.index";
import ChatRoom from "../components/Navbar/Messenger/ChatRoom/chat-room.index";
import UserProfile from "../components/User/UserProfile/user-profile.index";
import DefaultLayout from "../Globals/layouts/DefaultLayout";



interface RouterProps {
    path: string;
    component: any;
    layout?: ({ children }: { children: ReactNode }) => JSX.Element;
  }

export const publicRoutes : RouterProps[]=[
  {path:'/',component:HomePage ,layout: DefaultLayout},
  {path:'/all-user',component:AllUser,layout:DefaultLayout}

]

export const privateRoutes : RouterProps[] =[
  {path:'/profile',component:UserProfile,layout:DefaultLayout},
  {path:'/chat-room/:userId',component:ChatRoom,layout:DefaultLayout},
  {path:'/chat-room',component:ChatRoom,layout:DefaultLayout},
  
  
]