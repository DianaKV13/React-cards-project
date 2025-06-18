import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface CardType {
  _id: string;
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
}

const MyCards = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const user = useSelector((state: TRootState) => state.user.user);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (!user.isBusiness && !user.isAdmin) {
      toast.error("Only Business or Admin users can view their cards.");
      navigate("/");
      return;
    }

    const fetchCards = async () => {
      try {
        const { data } = await axios.get(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/my-cards",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setCards(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your cards.");
      }
    };

    fetchCards();
  }, [user, token, navigate]);

  const handleDelete = async (cardId: string) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      await axios.delete(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        {
          headers: {
            "x-auth-token": token ?? "",
          },
        }
      );

      setCards((prev) => prev.filter((card) => card._id !== cardId));
      toast.success("Card deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the card.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-500">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        My Business Cards
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {cards.map((card) => (
          <div
            key={card._id}
            className="rounded-lg shadow-lg overflow-hidden bg-gray-50 dark:bg-gray-800 relative transition-colors"
          >
            <img
              src={card.image?.url || "https://via.placeholder.com/512"}
              alt={card.image?.alt || card.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{card.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{card.subtitle}</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                <strong>Phone:</strong> {card.phone}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                <strong>Address:</strong> {card.address.city} {card.address.street} {card.address.houseNumber}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Card Number:</strong> {card._id.slice(-6)}
              </p>
            </div>
            <div className="p-2 flex justify-between items-center">
              <button
                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                aria-label="View Card Details"
                onClick={() => navigate(`/card/${card._id}`)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75M2.25 6.75L12 12.75l9.75-6M2.25 6.75L12 1.5l9.75 5.25"
                  />
                </svg>
              </button>

              <button
                className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                aria-label="Delete Card"
                onClick={() => handleDelete(card._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 group">
        <button
          onClick={() => navigate("/my-cards/new")}
          className="bg-gray-300 dark:bg-blue-500 hover:bg-pink-600 dark:hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition duration-300"
          aria-label="Add New Card"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="absolute right-full mr-3 bottom-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-sm rounded px-2 py-1">
          Add New Card
        </div>
      </div>
    </div>
  );
};

export default MyCards;
