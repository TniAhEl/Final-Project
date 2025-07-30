import React from "react";
import AccordionCard from "./AccordionCard";

const ProductCameraScreen = ({ data }) => {
  // data is an array of camera and screen details
  return <AccordionCard title="Camera & Màn hình" items={data || []} />;
};

export default ProductCameraScreen;
