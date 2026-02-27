"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SaleItem {
  product: string;
  quantity: number;
}

interface ProductOption {
  id: string;
  label: string;
}

interface SaleItemsFieldProps {
  items: SaleItem[];
  productOptions: ProductOption[];
  onChange: (items: SaleItem[]) => void;
  error?: string;
}

export function SaleItemsField({
  items,
  productOptions,
  onChange,
  error,
}: SaleItemsFieldProps) {
  const handleProductChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], product: value };
    onChange(updated);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      quantity: Math.max(1, Number(value)),
    };
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, { product: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="grid w-full gap-1.5">
      <div className="flex items-center justify-between mb-1">
        <Label>Items</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-3 w-3 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            {/* Product */}
            <div className="flex-1">
              <Select
                value={item.product}
                onValueChange={(val) => handleProductChange(index, val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="w-20">
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                placeholder="Qty"
              />
            </div>

            {/* Remove */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={items.length === 1}
              className="text-red-500 hover:text-red-600 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
