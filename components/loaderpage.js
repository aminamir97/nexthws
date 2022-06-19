import Image from "next/image";
import React from "react";
import img from "../assets/loadinggif.gif";

const Loaderpage = () => {
  return (
    <div className="loaderparent">
      <Image src={img.src} width={100} height={100} />
    </div>
  );
};

export default Loaderpage;
