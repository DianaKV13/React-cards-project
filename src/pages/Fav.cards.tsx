import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { TRootState } from "../store/store";

type TCard = {
  _id: string;
  title: string;
  subtitle?: string;
  phone?: string;
  bizNumber?: number;
  image?: { url: string; alt?: string };
  address?: {
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: number;
    zip?: number;
  };
  likes?: string[];
};

const FavCards = () => {
  const [likedCards, setLikedCards] = useState<string[]>([]);
  const [cards, setCards] = useState<TCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fadingCardId, setFadingCardId] = useState<string | null>(null);

  const user = useSelector((state: TRootState) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get<TCard[]>(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
        );
        const data = res.data;
        setCards(data);

        if (user?._id) {
          const liked = data
            .filter((card) => card.likes?.includes(user._id))
            .map((card) => card._id);
          setLikedCards(liked);
        }
      } catch (error) {
        console.error("Failed to fetch cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user?._id]);

  const toggleLike = async (cardId: string) => {
    if (!user) {
      alert("You must be logged in to like cards.");
      return;
    }

    try {
      await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("token") || "",
          },
        }
      );

      if (likedCards.includes(cardId)) {
        setFadingCardId(cardId);

        setTimeout(() => {
          setLikedCards((prev) => prev.filter((id) => id !== cardId));
          setFadingCardId(null);
        }, 400);
      } else {
        setLikedCards((prev) => [...prev, cardId]);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const likedCardObjects = cards.filter((card) => likedCards.includes(card._id));

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Your Favorite Cards
      </h1>

      {!user ? (
        <p className="text-red-600 dark:text-red-400 text-center font-medium">
          Please log in to view your favorite cards.
        </p>
      ) : loading ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">Loading...</p>
      ) : likedCardObjects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          You haven't liked any cards yet.
        </p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {likedCardObjects.map((card) => (
            <div
              key={card._id}
              className={`bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden flex flex-col justify-between cursor-pointer
                         transform transition-all duration-500 hover:scale-[1.03] hover:shadow-lg ${
                           fadingCardId === card._id ? "opacity-0 scale-95" : "opacity-100"
                         }`}
              onClick={() => navigate(`/card/${card._id}`)}
            >
              {card.image?.url && (
                <img
                  src={card.image.url}
                  alt={card.image.alt || card.title}
                  className="w-full h-40 object-cover rounded-t-md"
                />
              )}
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {card.title}
                  </h2>
                  {card.subtitle && (
                    <h3 className="text-gray-600 dark:text-gray-300">{card.subtitle}</h3>
                  )}
                  <div className="border-b border-gray-300 dark:border-gray-600 mt-2 mb-2" />
                  <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                    <p>
                      <span className="font-semibold">Phone:</span> {card.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {card.address
                        ? `${card.address.street || ""} ${
                            card.address.houseNumber || ""
                          }, ${card.address.city || ""}, ${card.address.country || ""}`
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Card Number:</span> {card.bizNumber || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-start items-center mt-4 gap-4">
                  <FaPhoneAlt className="text-black dark:text-white text-xl" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(card._id);
                    }}
                  >
                    {likedCards.includes(card._id) ? (
                      <FaHeart className="text-red-600 text-xl transition" />
                    ) : (
                      <FaRegHeart className="text-gray-500 dark:text-gray-300 text-xl transition hover:text-red-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavCards;
