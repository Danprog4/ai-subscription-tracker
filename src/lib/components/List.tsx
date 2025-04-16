import Sub from "./Sub";

interface ListItem {
  items: {
    subscriptionName: string;
    companyName: string;
    type: "monthly" | "yearly";
    price: number;
    renewDate: string;
  }[];
  setItems: (
    items: Array<{
      subscriptionName: string;
      companyName: string;
      type: "monthly" | "yearly";
      price: number;
      renewDate: string;
    }>,
  ) => void;
  removeItems: (
    items: Array<{
      subscriptionName: string;
      companyName: string;
      type: "monthly" | "yearly";
      price: number;
      renewDate: string;
    }>,
  ) => void;
}

// add id to items

const List = ({ items, setItems, removeItems }: ListItem) => {
  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Ensure items is an array and not empty
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-[600px] overflow-hidden rounded-lg bg-[#F2F2F7] text-black shadow-sm">
      {items.map((item, index) => (
        <Sub
          key={index}
          onDelete={() => handleDelete(index)}
          text={`${item.companyName} - ${item.subscriptionName}: $${item.price} (${item.type})${item.renewDate ? ` - Renews on ${new Date(item.renewDate).toLocaleDateString()}` : ""}`}
        />
      ))}
    </div>
  );
};

export default List;
