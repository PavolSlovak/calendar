import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TLoginSchema } from "../../../lib/types";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const inputStyles = "px-4 p-2 mt-2 rounded border border-black";
  async function onSubmit(data: TLoginSchema) {
    // useFormHook handleSubmit function already prevents default

    // TODO : submit to server
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-slate-100 rounded items-center shadow-lg border"
    >
      <h1 className="p-2">Log In</h1>
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
        className="btn-blue mt-2 disabled:bg-gray-300"
        disabled={isSubmitting}
      >
        Log In
      </button>
      <div className="flex flex-col items-center p-2">
        <p>If you don't have an account, please sign up:</p>
        <a href="/auth?signup" className="underline">
          Sign Up
        </a>
      </div>
    </form>
  );
}
// with Zod validation schema i can use validation schema on client side and server side
export default Login;
