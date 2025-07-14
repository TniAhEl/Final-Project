import React from "react";
import AccordionCard from "./AccordionCard";

const ProductUtilities = ({ data }) => (
  <AccordionCard title="Tiện ích" items={data || []} />
);

export default ProductUtilities;
