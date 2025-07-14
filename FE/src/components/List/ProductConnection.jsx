import React from "react";
import AccordionCard from "./AccordionCard";

const ProductConnection = ({ data }) => (
  <AccordionCard title="Kết nối" items={data || []} />
);

export default ProductConnection;
