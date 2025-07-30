import React from "react";
import AccordionCard from "./AccordionCard";

const ProductUtilities = ({ data }) => (
  <AccordionCard title="Utilities" items={data || []} />
);

export default ProductUtilities;
