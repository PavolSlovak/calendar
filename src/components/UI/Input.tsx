import type { ComponentPropsWithoutRef } from "react";

type InputProps = {
  label: string;
  id: string;
} & ComponentPropsWithoutRef<"input">;

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col py-2 w-full">
      <label htmlFor={id} className="pb-2 ">
        {label}
      </label>
      <input id={id} {...props} className="border border-black rounded p-2" />
    </div>
  );
}
