import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import { Button, FloatingLabel, Checkbox, Label } from "flowbite-react";
import { registerSchema } from "../validations/register.joi";

type FormData = {
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  phone: string;
  email: string;
  password: string;
  image: {
    url?: string;
    alt?: string;
  };
  address: {
    state?: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip?: number;
  };
  isBusiness: boolean;
  isAdmin?: boolean;
};

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      name: {
        first: "",
        middle: "",
        last: "",
      },
      phone: "",
      email: "",
      password: "",
      image: {
        url: "",
        alt: "",
      },
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: 0,
        zip: 0,
      },
      isBusiness: false,
    },
    mode: "onChange",
    resolver: joiResolver(registerSchema),
  });

  const submitForm = async (data: FormData) => {
    console.log("Form submitted", data);
    try {
      await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        data
      );
      console.log("registered successful:");
    } catch (error) {
      console.log("Error registering:", error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit(submitForm)}
        className="w-full max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FloatingLabel
            {...register("name.first")}
            variant="outlined"
            label="First Name"
            type="text"
            color={errors.name?.first ? "error" : "success"}
          />
          <FloatingLabel
            {...register("name.middle")}
            variant="outlined"
            label="Middle Name"
            type="text"
          />
          <FloatingLabel
            {...register("name.last")}
            variant="outlined"
            label="Last Name"
            type="text"
            color={errors.name?.last ? "error" : "success"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabel
            {...register("phone")}
            variant="outlined"
            label="Phone Number"
            type="text"
            color={errors.phone ? "error" : "success"}
          />
          <FloatingLabel
            {...register("email")}
            variant="outlined"
            label="Email"
            type="email"
            color={errors.email ? "error" : "success"}
          />
        </div>

        <FloatingLabel
          {...register("password")}
          variant="outlined"
          label="Password"
          type="password"
          color={errors.password ? "error" : "success"}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabel
            {...register("image.alt")}
            variant="outlined"
            label="Image Alt"
            type="text"
            color={errors.image?.alt ? "error" : "success"}
          />
          <FloatingLabel
            {...register("image.url")}
            variant="outlined"
            label="Image URL"
            type="text"
            color={errors.image?.url ? "error" : "success"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingLabel
            {...register("address.state")}
            variant="outlined"
            label="State"
            type="text"
            color={errors.address?.state ? "error" : "success"}
          />
          <FloatingLabel
            {...register("address.country")}
            variant="outlined"
            label="Country"
            type="text"
            color={errors.address?.country ? "error" : "success"}
          />
          <FloatingLabel
            {...register("address.city")}
            variant="outlined"
            label="City"
            type="text"
            color={errors.address?.city ? "error" : "success"}
          />
          <FloatingLabel
            {...register("address.street")}
            variant="outlined"
            label="Street"
            type="text"
            color={errors.address?.street ? "error" : "success"}
          />
          <FloatingLabel
            {...register("address.houseNumber")}
            variant="outlined"
            label="House Number"
            type="number"
            color={errors.address?.houseNumber ? "error" : "success"}
          />
          <FloatingLabel
            {...register("address.zip")}
            variant="outlined"
            label="Zip"
            type="number"
            color={errors.address?.zip ? "error" : "success"}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Checkbox {...register("isBusiness")} />
          <Label>Do you want to be a business user?</Label>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={!isValid}>
          Register
        </Button>
      </form>
    </main>
  );
}
