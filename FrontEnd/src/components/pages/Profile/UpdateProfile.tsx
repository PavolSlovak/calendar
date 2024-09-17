import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUpdateProfileSchema, updateProfileSchema } from "../../../lib/types";
import { useAuth } from "../../../store/authContext";
import { useEffect, useState } from "react";
import InfoBox from "../../UI/InfoBox";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../UI/Card";

function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
  });
  const navigate = useNavigate();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const inputStyles = "px-4 p-2 mt-4 rounded border border-black";
  useEffect(() => {
    console.log("currentUser", currentUser?.email);
  });
  function onSubmit(data: TUpdateProfileSchema) {
    // useFormHook handleSubmit function already prevents default
    let promises = [];

    try {
      if (data.email !== currentUser?.email) {
        promises.push(updateEmail(data.email));
      } else {
        console.log("No changes were made to the profile");
        setUpdateError("No changes were made to the profile");
      }
      if (data.password) {
        promises.push(updatePassword(data.password));
      }
      Promise.all(promises);

      navigate("/");
    } catch (error) {
      setUpdateError("Profile update failed!");
    }

    // TODO : submit to server
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <h1 className="p-2 w-full text-center">Update Profile</h1>
        {updateError && (
          <InfoBox mode="warning" severity="medium">
            {updateError}
          </InfoBox>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className={inputStyles}
          defaultValue={currentUser?.email || ""}
        />
        {errors.email && (
          <p className="text-red-500">{`${errors.email.message}`}</p>
        )}
        <input
          {...register("password", {
            // whatever is returned from the register, it will be passed to the input element. So value will be reflected in the input element
          })}
          type="password"
          placeholder="Leave blank to keep the same"
          className={inputStyles}
        />
        {errors.password && (
          <p className="text-red-500">{`${errors.password.message}`}</p>
        )}

        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Leave blank to keep the same"
          className={inputStyles}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
        )}
        <button
          className="btn-blue mt-4 disabled:bg-gray-300"
          disabled={isSubmitting}
        >
          Update
        </button>
        <div className="flex flex-col items-center">
          <Link to="/" className="underline">
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
}
// with Zod validation schema i can use validation schema on client side and server side
export default UpdateProfile;
