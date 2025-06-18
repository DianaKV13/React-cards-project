import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DarkThemeToggle } from "flowbite-react";

interface Card {
  title: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  web?: string;
  image?: {
    url: string;
    alt?: string;
  };
  address?: {
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: number;
  };
}

const CardDetails = () => {
  const [card, setCard] = useState<Card | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await axios.get(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`
        );
        setCard(response.data);
      } catch (error) {
        console.error("Error fetching card details:", error);
      }
    };

    fetchCardDetails();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <DarkThemeToggle />
      </div>

      <div className="max-w-xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 text-center mt-8 transition-all duration-500">
        {card ? (
          <>
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800 dark:text-white tracking-wide">
              {card.title}
            </h1>

            {card.image?.url && (
              <img
                src={card.image.url}
                alt={card.image.alt || card.title}
                className="mx-auto rounded-xl shadow-md mb-6 w-full max-w-sm object-cover h-64"
              />
            )}

            {card.subtitle && (
              <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4 italic">
                {card.subtitle}
              </h2>
            )}

            <div className="text-left space-y-3 text-gray-700 dark:text-gray-300 text-sm">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {card.email || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {card.phone || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Website:</span>{" "}
                {card.web ? (
                  <a
                    href={card.web}
                    className="text-sky-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {card.web}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {card.address
                  ? `${card.address.street || ""} ${card.address.houseNumber || ""}, ${card.address.city || ""}, ${card.address.country || ""}`
                  : "N/A"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Loading card details...</p>
        )}
      </div>
    </div>
  );
};

export default CardDetails;
