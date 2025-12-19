import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

export default function MarketingLayout(props: LayoutProps<"/">) {
  return (
    <div>
      <Navbar />
      {props.children}
      <Footer />
    </div>
  );
}
