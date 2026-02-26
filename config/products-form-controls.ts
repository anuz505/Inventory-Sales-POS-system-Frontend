import type { FormControl } from "@/types/form-types";

export const productFormControls: FormControl<Record<string, any>>[] = [
  {
    name: "name",
    label: "Product Name",
    placeholder: "Enter product name",
    componentType: "input",
    type: "text",
  },
  {
    name: "sku",
    label: "SKU",
    placeholder: "Enter SKU",
    componentType: "input",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter product description",
    componentType: "textarea",
  },
  {
    name: "category",
    label: "Category",
    placeholder: "Select a category",
    componentType: "select",
    options: [],
  },
  {
    name: "supplier",
    label: "Supplier",
    placeholder: "Select a supplier",
    componentType: "select",
    options: [],
  },
  {
    name: "cost_price",
    label: "Cost Price",
    placeholder: "0.00",
    componentType: "input",
    type: "number",
  },
  {
    name: "selling_price",
    label: "Selling Price",
    placeholder: "0.00",
    componentType: "input",
    type: "number",
  },
  {
    name: "stock_quantity",
    label: "Stock Quantity",
    placeholder: "0",
    componentType: "input",
    type: "number",
  },
  {
    name: "low_stock_limit",
    label: "Low Stock Limit",
    placeholder: "10",
    componentType: "input",
    type: "number",
  },
];
