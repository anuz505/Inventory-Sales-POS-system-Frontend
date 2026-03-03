import type { FormControl } from "@/types/form-types";

export const userFormControls: FormControl<Record<string, any>>[] = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "johndoe",
    componentType: "input",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "john@example.com",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Min. 8 characters",
    componentType: "input",
  },
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "John",
    componentType: "input",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Doe",
    componentType: "input",
  },
  {
    name: "role",
    label: "Role",
    type: "text",
    placeholder: "e.g. admin, staff",
    componentType: "input",
  },
  {
    name: "is_staff",
    label: "IsStaff",
    type: "boolean",
    placeholder: "is_staff",
    componentType: "checkbox",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "text",
    placeholder: "+1234567890",
    componentType: "input",
  },
];

// Password excluded — use the change_password endpoint for that
export const userEditFormControls = userFormControls.filter(
  (c) => c.name !== "password",
);
