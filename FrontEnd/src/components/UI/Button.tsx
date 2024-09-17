import { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { motion, MotionProps } from "framer-motion";
type BaseProps = {
  children: ReactNode;
  textOnly?: boolean;
};
type ButtonProps = ComponentPropsWithoutRef<"button"> &
  BaseProps & { to?: never };

type ButtonLinkProps = LinkProps & BaseProps & { to: string };

function isRouterLink(
  props: ButtonProps | ButtonLinkProps
): props is ButtonLinkProps {
  return "to" in props;
}

export default function Button(props: ButtonProps | ButtonLinkProps) {
  if (isRouterLink(props)) {
    const { children, ...otherProps } = props;

    return <Link {...otherProps}>{children}</Link>;
  }
  const { children, ...otherProps } = props;
  return <button {...otherProps}>{children}</button>;
}
