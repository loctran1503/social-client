import { MemoExoticComponent, ReactNode } from "react";
import HomePage from "../components/HomePage";
import UserProfile from "../components/User/UserProfile/user-profile.index";
import DefaultLayout from "../Globals/layouts/DefaultLayout";



interface RouterProps {
    path: string;
    component: any;
    layout?: ({ children }: { children: ReactNode }) => JSX.Element;
  }

export const publicRoutes : RouterProps[]=[
  {path:'/',component:HomePage ,layout: DefaultLayout},

]

export const privateRoutes : RouterProps[] =[
  {path:'/profile',component:UserProfile,layout:DefaultLayout}
]