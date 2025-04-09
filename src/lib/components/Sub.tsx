import React from "react";
import SwipeToDelete from "react-swipe-to-delete-ios";
import ListItem from "./ListItem";

interface SubProps {
  onDelete?: () => void;
  text: string;
}

const Sub: React.FC<SubProps> = ({ onDelete, text }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="mb-[1px] bg-white">
      <SwipeToDelete
        onDelete={handleDelete}
        transitionDuration={250}
        deleteWidth={75}
        height={95}
        deleteColor="rgba(252, 58, 48, 1.00)"
        deleteText="Delete"
        disabled={false}
      >
        <ListItem text={text} />
      </SwipeToDelete>
    </div>
  );
};

export default Sub;
