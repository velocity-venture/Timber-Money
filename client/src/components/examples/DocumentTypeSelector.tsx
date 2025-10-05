import { DocumentTypeSelector } from "../DocumentTypeSelector";
import { useState } from "react";

export default function DocumentTypeSelectorExample() {
  const [selectedType, setSelectedType] = useState<string>("credit-cards");
  
  return (
    <DocumentTypeSelector 
      onSelect={(typeId) => {
        setSelectedType(typeId);
        console.log("Selected document type:", typeId);
      }}
      selectedType={selectedType}
    />
  );
}
