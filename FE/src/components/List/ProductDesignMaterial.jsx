import React from "react";
import AccordionCard from "./AccordionCard";

const ProductDesignMaterial = ({ data }) => (
  <AccordionCard title="Design & Material" items={data || []} />
);

export default ProductDesignMaterial;
