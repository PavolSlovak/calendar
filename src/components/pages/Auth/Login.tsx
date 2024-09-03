import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signUpSchema, TLoginSchema } from "../../../lib/types";
import { useAuth } from "../../../store/authContext";
import { useEffect, useState } from "react";
import InfoBox from "../../UI/InfoBox";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const [loginupError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const inputStyles = "px-4 p-2 mt-4 rounded border border-black";
  async function onSubmit(data: TLoginSchema) {
    // useFormHook handleSubmit function already prevents default
    try {
      // TODO : submit to server
      setLoginError(null);
      console.log("jebo");
      await login(data.email, data.password);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Failed to login!");
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
      <h1 className="p-2 w-full text-center">Log In</h1>
      {loginupError && (
        <InfoBox mode="warning" severity="medium">
          {loginupError}
        </InfoBox>
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

      <button
        className="btn-blue mt-4 disabled:bg-gray-300"
        disabled={isSubmitting}
      >
        Log In
      </button>
      <div className="flex flex-col items-center p-2">
        <p>If you don't have an account, please sign up:</p>
        <Link to="/auth?signup" className="underline">
          Sign Up
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <Link to="/auth?forgot-password" className="underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
// with Zod validation schema i can use validation schema on client side and server side
export default Login;
