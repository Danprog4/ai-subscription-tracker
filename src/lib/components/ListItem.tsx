import React from "react";

interface ListItemProps {
  text: string;
}

const ListItem: React.FC<ListItemProps> = ({ text }) => {
  return (
    <div className="flex min-h-[50px] items-center border-b border-[#E5E5EA] bg-white px-4 py-3">
      <span className="font-[-apple-system,BlinkMacSystemFont,system-ui,Roboto,sans-serif] text-base text-black">
        {text}
      </span>
    </div>
  );
};

export default ListItem;
