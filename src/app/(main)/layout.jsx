

import Navbar from "@/components/Navbar";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      {/* <BreakingNews /> */}
      <Navbar />
      {children}
    </>
  );
};

export default MainLayout;
