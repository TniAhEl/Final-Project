import React from "react";
import AccordionCard from "./AccordionCard";

const ProductConfig = ({ data }) => (
  <AccordionCard title="Configuration" items={data || []} />
);

export default ProductConfig;
