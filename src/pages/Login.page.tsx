import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { loginSchema } from "../validations/login.joi";
import { Button, FloatingLabel } from "flowbite-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");

    try {
      const res = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
        data
      );

      console.log("Login response data:", res.data);

      // Adjust token extraction depending on response shape:
      // If the API returns the token as a string directly:
      const token =
        typeof res.data === "string" ? res.data : res.data.token ?? "";

      if (!token) {
        setServerError("Login failed: No token returned.");
        return;
      }

      localStorage.setItem("token", token);

      const decoded = jwtDecode<{
        _id: string;
        name: { first: string; middle?: string; last: string };
        isBusiness: boolean;
        isAdmin?: boolean;
      }>(token);

      dispatch(userActions.login(decoded));

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("❌ Login failed", err.response?.data || err.message);
        setServerError("Login failed. Please check your credentials.");
      } else {
        console.error("❌ Unexpected error", err);
        setServerError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Login
        </h2>

        <div className="mb-4">
          <FloatingLabel
            {...register("email")}
            label="Email"
            variant="outlined"
            type="email"
            color={errors.email ? "error" : undefined}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <FloatingLabel
            {...register("password")}
            label="Password"
            variant="outlined"
            type="password"
            color={errors.password ? "error" : undefined}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-red-600 text-sm text-center mb-2">{serverError}</p>
        )}

        <Button type="submit" disabled={!isValid} className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
