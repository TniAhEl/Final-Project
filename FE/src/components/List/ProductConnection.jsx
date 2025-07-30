import React from "react";
import AccordionCard from "./AccordionCard";

const ProductConnection = ({ data }) => (
  <AccordionCard title="Connection" items={data || []} />
);

export default ProductConnection;
