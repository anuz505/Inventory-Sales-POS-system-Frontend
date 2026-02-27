import { FormControl } from "@/types/form-types";
import { SaleFormData } from "@/components/sales/all-sales"; // adjust path if needed

export const salesFormControls: FormControl<SaleFormData>[] = [
  {
    name: "customer",
    label: "Customer",
    componentType: "select",
    placeholder: "Select customer",
    options: [],
  },
  {
    name: "discount_amount",
    label: "Discount Amount",
    componentType: "input",
    type: "number",
    placeholder: "0",
  },
  {
    name: "payment_method",
    label: "Payment Method",
    componentType: "select",
    placeholder: "Select method",
    options: [
      { id: "cash", label: "Cash" },
      { id: "card", label: "Card" },
      { id: "upi", label: "UPI" },
      { id: "wallet", label: "Wallet" },
      { id: "net_banking", label: "Net Banking" },
    ],
  },
  {
    name: "payment_status",
    label: "Payment Status",
    componentType: "select",
    placeholder: "Select status",
    options: [
      { id: "completed", label: "Completed" },
      { id: "pending", label: "Pending" },
      { id: "refunded", label: "Refunded" },
    ],
  },
  {
    name: "notes",
    label: "Notes",
    componentType: "textarea",
    placeholder: "Optional notes...",
  },
];
