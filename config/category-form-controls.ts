import type { FormControl } from "@/types/form-types";
import type { CreateCategoryType } from "@/hooks/use-category";

export const categoryFormControls: FormControl<CreateCategoryType>[] = [
  {
    name: "name",
    label: "Category Name",
    placeholder: "Enter category name",
    type: "text",
    componentType: "input",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter a brief description (optional)",
    type: "text",
    componentType: "textarea",
  },
];
