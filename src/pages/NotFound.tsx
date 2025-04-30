
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md rounded-lg border shadow-md bg-white">
        <h1 className="text-5xl font-bold mb-4 text-charity-primary">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-6">
          The page you're looking for ({location.pathname}) doesn't exist or has been moved.
        </p>
        <Button
          variant="default"
          className="bg-charity-primary hover:bg-charity-dark"
          onClick={() => window.location.href = "/organization"}
        >
          Return to Organization Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
