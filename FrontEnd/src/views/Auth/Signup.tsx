import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, TSignUpSchema } from "../../lib/types";
import { useAuth } from "../../store/authContext";
import { useState } from "react";
import InfoBox from "../../components/UI/InfoBox";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { signupUser } from "../../utils/http";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string | null>(null);
  const { signup } = useAuth();
  const inputStyles = "px-4 p-2 mt-4 rounded border border-black";

  async function onSubmit(data: TSignUpSchema) {
    // useFormHook handleSubmit function already prevents default
    try {
      // TODO : submit to server
      setSignupError(null);

      const userCredentials: any = await signup(data.email, data.password);

      const uid = userCredentials.user?.uid;
      const additionalUserData = {
        uid: uid,
        role: "user",
        isMember: [],
        colorStamp: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };

      await signupUser(additionalUserData); // Save additional user data to MongoDB

      navigate("/"); // Redirect to home page
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <h1 className="p-2 w-full text-center">Sign Up</h1>
      {signupError && (
        <InfoBox mode="warning" severity="medium">
          {signupError}
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
      <div className="flex flex-col items-center">
        <p>If you already have account, please login:</p>
        <Link to="/auth?login" className="underline">
          Log In
        </Link>
      </div>
    </form>
  );
}
// with Zod validation schema i can use validation schema on client side and server side
export default Signup;
