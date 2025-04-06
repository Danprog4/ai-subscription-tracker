import React, { useState } from "react";
import Sub from "./Sub";

interface ListItem {
  id: string;
  text: string;
  dotColor?: string;
}

const List: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([
    { id: "1", text: "Item 1", dotColor: "#8A4F9E" },
    { id: "2", text: "Item 2", dotColor: "#69A5E4" },
    { id: "3", text: "Item 3", dotColor: "#1B4EA3" },
    { id: "6", text: "Item 6", dotColor: undefined },
    { id: "7", text: "Item 7", dotColor: "#90C957" },
  ]);

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-[600px] overflow-hidden rounded-lg bg-[#F2F2F7] text-black shadow-sm">
      {items.map((item) => (
        <Sub key={item.id} onDelete={() => handleDelete(item.id)} text={item.text} />
      ))}
    </div>
  );
};

export default List;
