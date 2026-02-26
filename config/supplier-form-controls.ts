import type { FormControl } from "@/types/form-types";
export const supplierFormControls: FormControl<Record<string, any>>[] = [
  {
    name: "name",
    label: "Supplier Name",
    placeholder: "Enter supplier name",
    type: "text",
    componentType: "input",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email address",
    type: "email",
    componentType: "input",
  },
  {
    name: "phone",
    label: "Phone",
    placeholder: "Enter phone number",
    type: "number",
    componentType: "input",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter full address",
    type: "text",
    componentType: "textarea",
  },
];
