import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { TRootState } from "../store/store";
import axios from "axios";

interface Card {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
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
}

interface HomeProps {
  searchQuery: string;
}

const Home = ({ searchQuery }: HomeProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [likedCards, setLikedCards] = useState<string[]>([]);
  const cardsPerPage = 9;
  const navigate = useNavigate();
  const user = useSelector((state: TRootState) => state.user.user);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
        );
        const data: Card[] = await res.json();
        setCards(data);

        if (user?._id) {
          const liked = data
            .filter((card) => card.likes?.includes(user._id))
            .map((card) => card._id);
          setLikedCards(liked);
        }
      } catch (err) {
        console.error("Fetch error:", err);
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

      setLikedCards((prev) =>
        prev.includes(cardId)
          ? prev.filter((id) => id !== cardId)
          : [...prev, cardId]
      );
    } catch (err) {
      console.error("Error liking card:", err);
    }
  };

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = filteredCards.slice(startIndex, startIndex + cardsPerPage);

  const getPaginationRange = () => {
    const range = [];
    const maxPagesToShow = 4;
    let startPage = currentPage;

    if (startPage + maxPagesToShow - 1 > totalPages) {
      startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
    }

    for (let i = startPage; i < startPage + maxPagesToShow && i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-2 mt-8 text-gray-800 dark:text-white">
        Cards Page
      </h1>

      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Here you can find business cards from all categories
      </p>

      <div className="border-b border-gray-300 dark:border-gray-600 mb-12" />

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading cards…</p>
      ) : currentCards.length > 0 ? (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {currentCards.map((card) => (
              <div
                key={card._id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden flex flex-col justify-between"
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
                      <h3 className="text-gray-600 dark:text-gray-300">
                        {card.subtitle}
                      </h3>
                    )}
                    <div className="border-b border-gray-300 dark:border-gray-600 mt-2 mb-2" />
                    <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {card.phone || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Address:</span>{" "}
                        {card.address
                          ? `${card.address.street || ""} ${card.address.houseNumber || ""}, ${card.address.city || ""}, ${card.address.country || ""}`
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Card Number:</span>{" "}
                        {card.bizNumber || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 gap-4">
                    <div className="flex items-center gap-3">
                      <FaPhoneAlt className="text-black dark:text-white text-xl" />
                      <button onClick={() => toggleLike(card._id)}>
                        {likedCards.includes(card._id) ? (
                          <FaHeart className="text-red-600 text-xl transition" />
                        ) : (
                          <FaRegHeart className="text-gray-500 dark:text-gray-300 text-xl transition hover:text-red-400" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/card/${card._id}`)}
                      className="bg-gray-200 dark:bg-blue-900 hover:bg-gray-300 dark:hover:bg-blue-800 text-gray-800 dark:text-white font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                    >
                      View For More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-3 mt-6 text-gray-700 dark:text-gray-300 select-none">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              &lt;
            </button>

            {paginationRange.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-gray-400 dark:bg-gray-300 text-white dark:text-gray-900 font-semibold"
                    : "hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              &gt;
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">No cards found.</p>
      )}
    </div>
  );
};

export default Home;
