export interface Option {
  id: string;
  label: string;
}
export interface FormControl<T> {
  name: Extract<keyof T, string>;
  label: string;
  placeholder?: string;
  componentType: "input" | "select" | "textarea" | "checkbox";
  type?: string;
  options?: Array<{ id: string; label: string }>;
  controls?: FormControl<any>[];
}

export interface CommonFormProps<T> {
  formControls: FormControl<T>[];
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  buttonText?: string;
  isBtnDisabled?: boolean;
  errors?: { [K in keyof T]?: string };
}
