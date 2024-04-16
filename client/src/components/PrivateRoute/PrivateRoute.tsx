import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

const privateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) {
        return <Navigate to="/auth/login" />
    }

    return children;
};

export default privateRoute;