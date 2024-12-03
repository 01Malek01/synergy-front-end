import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useGetProfile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getProfileReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/profile`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const { data: profile, isLoading } = useQuery({
    queryFn: getProfileReq,
    queryKey: ["profile"],
  });

  return { profile, isLoading };
};
export default useGetProfile;
