"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { CommonFormProps, FormControl } from "@/types/form-types";

const CommonForm = <T extends Record<string, any>>({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled = false,
  errors = {},
}: CommonFormProps<T>) => {
  function renderInputsByComponentType(
    getControlItem: FormControl<T>,
  ): React.ReactElement {
    let element: React.ReactElement;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={String(getControlItem.name)}
            placeholder={getControlItem.placeholder}
            id={String(getControlItem.name)}
            type={getControlItem.type || "text"}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={String(getControlItem.name)}
            placeholder={getControlItem.placeholder}
            id={String(getControlItem.name)}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "checkbox":
        element = (
          <div className="flex items-center gap-2">
            <Checkbox
              id={String(getControlItem.name)}
              checked={!!formData[getControlItem.name]}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: checked,
                })
              }
            />
            <span className="text-sm text-muted-foreground">
              {getControlItem.placeholder}
            </span>
          </div>
        );
        break;

      default:
        element = (
          <Input
            name={String(getControlItem.name)}
            placeholder={getControlItem.placeholder}
            id={String(getControlItem.name)}
            type={getControlItem.type || "text"}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      {(errors.non_field_errors || errors.detail) && (
        <div className="text-sm text-red-600 mb-2">
          {errors.non_field_errors || errors.detail}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div
            className={`grid w-full gap-1.5 ${
              controlItem.componentType === "checkbox"
                ? "flex flex-row items-center justify-between rounded-lg border p-3"
                : ""
            }`}
            key={String(controlItem.name)}
          >
            {errors[controlItem.name as string] && (
              <div className="text-sm text-red-600 mb-1">
                {errors[controlItem.name as string]}
              </div>
            )}
            <Label
              htmlFor={String(controlItem.name)}
              className={
                controlItem.componentType === "checkbox"
                  ? "cursor-pointer"
                  : "mb-1"
              }
            >
              {controlItem.label}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
