import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, TSignUpSchema } from "../../../lib/types";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: TSignUpSchema) {
    // useFormHook handleSubmit function already prevents default

    // TODO : submit to server
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    reset();
  }
  return (
    <div className="flex justify-center py-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col  bg-yellow-200 rounded items-center"
      >
        <h1>Sign Up</h1>
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="px-4 p-2 mt-2  rounded"
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
          className="px-4 p-2 mt-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500">{`${errors.password.message}`}</p>
        )}

        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className="px-4 p-2 mt-2 rounded"
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
        )}
        <button
          className="btn-blue mt-2 disabled:bg-gray-300"
          disabled={isSubmitting}
        >
          Sign Up
        </button>
        <p>If you don't have an account, please sign up:</p>
        <a href="/auth?signup">Sign Up</a>
      </form>
    </div>
  );
}
// with Zod validation schema i can use validation schema on client side and server side
export default Signup;
