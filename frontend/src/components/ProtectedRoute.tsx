import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    console.log(session)
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) return null; // or a loading spinner

  return <>{children}</>;
};

export default ProtectedRoute;