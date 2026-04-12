import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/delivery", { replace: true });
  }, [navigate]);

  return null;
}

export default Checkout;
