import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "About | BCard";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-5xl font-extrabold text-center mb-6">
          About <span className="text-blue-600 dark:text-blue-400">BCard</span>
        </h1>

        <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">What is BCard?</h2>
          <p className="text-lg leading-relaxed">
            <span className="font-semibold">BCard</span> is a modern platform designed to help you
            explore, manage, and share business cards with ease. Whether you're a professional,
            freelancer, or small business owner, BCard offers a sleek and efficient way to connect
            with others and showcase your business.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Who Can Use It?</h2>
          <p className="text-lg leading-relaxed">
            Anyone can join BCard to browse through a collection of professional business cards.
            Users who register as <span className="font-semibold">Business Accounts</span> gain
            access to powerful tools to create and manage their own cards directly from the
            platform.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>✨ View and explore public business cards</li>
            <li>📝 Business users can create and edit cards</li>
            <li>❤️ Save your favorite cards</li>
            <li>🌙 Supports both light and dark mode</li>
            <li>🔒 Secure login with user roles</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Meet the Creator</h2>
          <p className="text-lg leading-relaxed">
            This project was built with care by a passionate full-stack developer as part of a
            learning journey. Every part of this app — from authentication to beautiful UI — was
            carefully crafted to reflect creativity, simplicity, and functionality.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
