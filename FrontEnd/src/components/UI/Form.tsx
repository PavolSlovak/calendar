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
    return (
      <div className={`flex flex-col py-2 w-full ${className}`}>
        {label && (
          <label htmlFor={id} className={`pb-2 ${labelClassName}`}>
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

Form.Group = Group;
Form.Input = Input;
Form.Footer = Footer;
