
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return null; // The component will redirect, so no need to render anything
}
