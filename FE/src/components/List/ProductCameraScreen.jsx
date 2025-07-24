import React from "react";
import AccordionCard from "./AccordionCard";

const ProductCameraScreen = ({ data }) => {
  // data là mảng các chi tiết, ví dụ: ["Camera 50MP", "Chống rung OIS", ...]
  return <AccordionCard title="Camera & Màn hình" items={data || []} />;
};

export default ProductCameraScreen;
