import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBFA]">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-8xl font-serif text-[#E8D5D8]">404</h1>
        <div className="space-y-2">
          <p className="text-xl font-serif text-[#4A3F3F]">Moment not found</p>
          <p className="text-sm text-[#8C7E7E]">The path {location.pathname} does not exist in your Glowé journey.</p>
        </div>
        <a 
          href="/" 
          className="inline-block px-8 py-4 rounded-full bg-[#4A3F3F] text-white font-bold text-sm shadow-lg hover:bg-[#2D2424] transition-all"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;