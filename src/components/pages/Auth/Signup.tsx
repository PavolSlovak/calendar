import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, TSignUpSchema } from "../../../lib/types";
import { useAuth } from "../../../store/authContext";
import { useState } from "react";
import ErrorBlock from "../../UI/ErrorBlock";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const [signupError, setSignupError] = useState<string | null>(null);
  const { signup } = useAuth();
  const inputStyles = "px-4 p-2 mt-4 rounded border border-black";
  async function onSubmit(data: TSignUpSchema) {
    // useFormHook handleSubmit function already prevents default
    try {
      // TODO : submit to server
      setSignupError(null);
      await signup(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
      setSignupError("Failed to create an account");
    }

    // TODO : submit to server

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex  bg-slate-100 rounded shadow-lg border"
    >
      <div className="flex flex-col p-4  ">
        <h1 className="p-2 w-full text-center">Sign Up</h1>
        {signupError && (
          <ErrorBlock mode="warning" severity="medium">
            {signupError}
          </ErrorBlock>
        )}
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className={inputStyles}
        />
        {errors.email && (
          <p className="text-red-500">{`${errors.email.message}`}</p>
        )}
        <input
          {...register("password", {
            // whatever is returned from the register, it will be passed to the input element. So value will be reflected in the input element
          })}
          type="password"
          placeholder="Password"
          className={inputStyles}
        />
        {errors.password && (
          <p className="text-red-500">{`${errors.password.message}`}</p>
        )}

        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className={inputStyles}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
        )}
        <button
          className="btn-blue mt-4 disabled:bg-gray-300"
          disabled={isSubmitting}
        >
          Sign Up
        </button>
        <div className="flex flex-col items-center p-2">
          <p>If you don't have an account, please sign up:</p>
          <a href="/auth?login" className="underline">
            Log In
          </a>
        </div>
      </div>
    </form>
  );
}
// with Zod validation schema i can use validation schema on client side and server side
export default Signup;
