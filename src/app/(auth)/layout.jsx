
import React from "react";
import { montserrat } from "../layout";
import Navbar from "@/components/Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className={`${montserrat.className} bg-[#f3f4f6] min-h-screen flex flex-col`}>
      <Navbar />
      {children}
    </div>
  );
};

export default AuthLayout;
