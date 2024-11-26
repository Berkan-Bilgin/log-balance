"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddTransactionButtonProps {
  onClick: () => void;
}

export const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({
  onClick,
}) => {
  return (
    <Button variant="default" size="sm" onClick={onClick}>
      <Plus className="h-4 w-4 mr-2" />
      İşlem Ekle
    </Button>
  );
};
