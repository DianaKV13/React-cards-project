import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// Components
import Header from "./components/Header";
import CardDetails from "../src/components/CardDetails";

// Pages
import Home from "./pages/Home.page";
import About from "./pages/About.page";
import Register from "./pages/Register.page";
import Login from "./pages/Login.page";
import ErrorPage from "./pages/Error.page";
import FavCards from "./pages/Fav.cards";
import MyCards from "./pages/My.cards";
import NewCard from "./pages/New.card";
import ProfilePage from "./pages/Profile.page";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/home" element={<Home searchQuery={searchQuery} />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fav-cards" element={<FavCards />} />
        <Route path="/my-cards" element={<MyCards />} />
        <Route path="/card/:id" element={<CardDetails />} />
        <Route path="/my-cards/new" element={<NewCard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
