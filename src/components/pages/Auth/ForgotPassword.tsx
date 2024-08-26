import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, TResetPasswordSchema } from "../../../lib/types";
import { useAuth } from "../../../store/authContext";
import { useEffect, useState } from "react";
import ErrorBlock from "../../UI/ErrorBlock";
import { Link } from "react-router-dom";

function ForgorPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [message, setMessage] = useState<string | null>(null);
  const { resetPassword } = useAuth();
  const inputStyles = "px-4 p-2 mt-4 rounded border border-black";
  async function onSubmit(data: TResetPasswordSchema) {
    try {
      setMessage(null);
      // TODO : submit to server
      await resetPassword(data.email);
      setMessage("Check your email for further instructions");
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError("email", {
        type: "manual",
        message: error.message,
      });
    }

    // TODO : submit to server

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    reset();
  }
  useEffect(() => {
    console.log(errors);
  });
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col align-middle"
    >
      <h1 className="p-2 w-full text-center">Password Reset</h1>
      {errors.email && (
        <ErrorBlock mode="warning" severity="medium">
          {errors.email.message}
        </ErrorBlock>
      )}
      {message && <ErrorBlock mode="success">{message}</ErrorBlock>}
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className={inputStyles}
      />
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}

      <button
        className="btn-blue mt-4 disabled:bg-gray-300"
        disabled={isSubmitting}
      >
        Reset Password
      </button>
      <div className="flex flex-col items-center p-2">
        <Link to="/aut h?login" className="underline">
          Log In
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <p>If you don't have an account, please sign up:</p>
        <Link to="/auth?signup" className="underline">
          Sign Up
        </Link>
      </div>
    </form>
  );
}
// with Zod validation schema i can use validation schema on client side and server side
export default ForgorPassword;
