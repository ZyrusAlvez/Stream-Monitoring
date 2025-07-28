import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const session = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session === null) return; // wait for session to load
    if (!session) navigate("/login");
    else setLoading(false);
  }, [session, navigate]);

  if (loading) return <div>Loading...</div>; // prevent flicker

  return <>{children}</>;
};


export default ProtectedRoute;