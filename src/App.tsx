import { privateRoutes, publicRoutes } from "./routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactNode } from "react";
import NoneLayout from "./Globals/layouts/NoneLayout";
import NotFound from "./Globals/NotFound/not-found.index";
import Loader from "./Globals/styles/Loader/loader.index";
import React from "react";
import axios from "axios";
import ProtectedRoute from "./routes/ProtectedRoute";
function App() {
  
  return (
    <>
    <BrowserRouter>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout: ({
              children,
            }: {
              children: ReactNode;
            }) => JSX.Element = route.layout || NoneLayout;

            return (
              <Route
                path={route.path}
                element={
                 
                    <Layout>
                      <Page />
                    </Layout>
               
                }
                key={index}
              />
            );
          })}

          {privateRoutes.map((route, index) => {
            const Page = route.component;
            const Layout: ({
              children,
            }: {
              children: ReactNode;
            }) => JSX.Element = route.layout || NoneLayout;

            return (
              <Route
                path={route.path}
                element={
            
                  <Layout>
                    <ProtectedRoute component={Page} />
             
                  </Layout>
              
                }
                key={index}
              />
            );
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Loader/>
    </>
  );
}

export default App;
