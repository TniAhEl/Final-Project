import React from "react";
import AccordionCard from "./AccordionCard";

const ProductDesignMaterial = ({ data }) => (
  <AccordionCard title="Thiết kế & Chất liệu" items={data || []} />
);

export default ProductDesignMaterial;
