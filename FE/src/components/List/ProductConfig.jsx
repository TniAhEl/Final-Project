import React from "react";
import AccordionCard from "./AccordionCard";

const ProductConfig = ({ data }) => (
  <AccordionCard title="Cấu hình" items={data || []} />
);

export default ProductConfig;
