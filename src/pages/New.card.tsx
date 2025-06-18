import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { newCardSchema } from "../validations/new";
import { FloatingLabel, Button } from "flowbite-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

type FormData = {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
  };
};

const NewCard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: TRootState) => state.user.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    if (!user.isBusiness) {
      toast.error("Only Business users can create cards.");
      navigate("/");
    }
  }, [user, token, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: joiResolver(newCardSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.isBusiness) {
      toast.error("Only Business users can create cards.");
      return;
    }
    if (!token) {
      toast.error("Authentication token missing.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards", data, {
        headers: {
          "x-auth-token": token,
        },
      });

      toast.success("Card created successfully!");
      reset();
      navigate("/my-cards");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create card.");
    }
  };

  if (!user || !token || !user.isBusiness) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Business Card</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <FloatingLabel variant="outlined" label="Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <FloatingLabel variant="outlined" label="Subtitle" {...register("subtitle")} />
        {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}

        <div className="md:col-span-2">
          <FloatingLabel variant="outlined" label="Description" {...register("description")} />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <FloatingLabel variant="outlined" label="Phone (e.g. 0501234567)" {...register("phone")} />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

        <FloatingLabel variant="outlined" label="Email" {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <div className="md:col-span-2">
          <FloatingLabel variant="outlined" label="Website URL (optional)" {...register("web")} />
          {errors.web && <p className="text-red-500">{errors.web.message}</p>}
        </div>

        <FloatingLabel variant="outlined" label="Image URL (optional)" {...register("image.url")} />
        {errors.image?.url && <p className="text-red-500">{errors.image.url.message}</p>}

        <FloatingLabel variant="outlined" label="Image Alt Text (optional)" {...register("image.alt")} />
        {errors.image?.alt && <p className="text-red-500">{errors.image.alt.message}</p>}

        <FloatingLabel variant="outlined" label="State" {...register("address.state")} />
        {errors.address?.state && <p className="text-red-500">{errors.address.state.message}</p>}

        <FloatingLabel variant="outlined" label="Country" {...register("address.country")} />
        {errors.address?.country && <p className="text-red-500">{errors.address.country.message}</p>}

        <FloatingLabel variant="outlined" label="City" {...register("address.city")} />
        {errors.address?.city && <p className="text-red-500">{errors.address.city.message}</p>}

        <FloatingLabel variant="outlined" label="Street" {...register("address.street")} />
        {errors.address?.street && <p className="text-red-500">{errors.address.street.message}</p>}

        <FloatingLabel variant="outlined" label="House Number" type="number" {...register("address.houseNumber")} />
        {errors.address?.houseNumber && <p className="text-red-500">{errors.address.houseNumber.message}</p>}

        <FloatingLabel variant="outlined" label="ZIP Code" type="number" {...register("address.zip")} />
        {errors.address?.zip && <p className="text-red-500">{errors.address.zip.message}</p>}

        <div className="md:col-span-2 flex justify-center mt-4">
          <Button type="submit" color="purple">
            Create Card
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewCard;
