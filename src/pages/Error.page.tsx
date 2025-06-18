import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { FiHelpCircle } from "react-icons/fi";

const ErrorPage = () => {
  const navigate = useNavigate();

  const navHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <FiHelpCircle className ="text-blue-500 dark:text-blue-300 text-6xl mb-4 animate-pulse" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button onClick={navHome} color="blue">
        Go Back Home
      </Button>
    </div>
  );
};

export default ErrorPage;
