import {
  ComponentPropsWithoutRef,
  FormEvent,
  forwardRef,
  ReactNode,
  RefAttributes,
} from "react";

type FormProps = {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};
export const Form = ({
  children,
  onSubmit,
}: FormProps &
  ComponentPropsWithoutRef<"form"> & // add all the props of the form element
  RefAttributes<HTMLFormElement>) => {
  return (
    <form onSubmit={onSubmit} className="form">
      {children}
    </form>
  );
};

type GroupProps = {
  children: ReactNode;
  className?: string;
};
const Group = ({ children, className }: GroupProps) => {
  return <div className={className}>{children}</div>;
};
type InputProps = {
  label: string;
  id: string;
  className?: string;
  labelClassName?: string;
  inputClassname?: string;
} & ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, id, className, labelClassName, inputClassname, ...inputProps },
    ref
  ) => {
    const classLayout = className?.includes("flex-row")
      ? "flex flex-row"
      : "flex flex-col";
    return (
      <div className={`${classLayout} py-2 w-full ${className}`}>
        {label && (
          <label htmlFor={id} className={`pb-1 text-sm ${labelClassName}`}>
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          {...inputProps}
          className={`border border-black rounded p-2 ${inputClassname}`}
        />
      </div>
    );
  }
);

Input.displayName = "Input"; // Needed for React DevTools when using forwardRef

export default Input;

type TFormFooterProps = {
  className?: string;
  actionsClassName?: string;
  children?: ReactNode;
};
const Footer = ({
  className,
  actionsClassName,
  children,
}: TFormFooterProps) => {
  return (
    <div className={`p-4 flex justify-center ${className}`}>
      <div className={actionsClassName}>{children}</div>
    </div>
  );
};

type SelectProps = {
  label: string;
  id?: string;
  className?: string;
  options?: { value: string; label: string }[];
  children?: ReactNode; // Allow children to be passed in as well
  labelClassName?: string;
  selectClassName?: string;
} & ComponentPropsWithoutRef<"select">;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      id,
      className,
      children,
      options = [],
      labelClassName,
      selectClassName,
      ...selectProps
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col py-2 w-full ${className}`}>
        {label && (
          <label htmlFor={id} className={`pb-1 text-sm ${labelClassName}`}>
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          {...selectProps}
          className={`border border-black rounded p-2 ${selectClassName}`}
        >
          {options.length > 0
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
      </div>
    );
  }
);
Form.Group = Group;
Form.Input = Input;
Form.Select = Select;
Form.Footer = Footer;
