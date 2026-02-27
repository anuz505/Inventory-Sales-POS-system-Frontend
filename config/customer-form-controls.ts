import type { FormControl } from "@/types/form-types";
import type { NewCustomer } from "@/types/customer-types";

export const customerFormControls: FormControl<NewCustomer>[] = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "Enter customer name",
    type: "text",
    componentType: "input",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter customer email",
    type: "email",
    componentType: "input",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    placeholder: "Enter phone number",
    type: "tel",
    componentType: "input",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter address",
    type: "text",
    componentType: "textarea",
  },
];
