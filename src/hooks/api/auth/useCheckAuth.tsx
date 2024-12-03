import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useCheckAuth = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const checkAuthReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/auth/check-auth`, {
        withCredentials: true,
      });
      if (res.status === 401) throw new Error("Unauthorized");
      // console.log(res.data);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error(" An error occurred");
    }
  };
  const {
    data: user,
    isLoading,
    isSuccess,
  } = useQuery({
    queryFn: checkAuthReq,
    queryKey: ["checkAuth"],
  });
  return { user, isLoading, isSuccess };
};
export default useCheckAuth;
