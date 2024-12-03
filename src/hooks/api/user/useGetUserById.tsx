import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const useGetUserById = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const getUserByIdReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/${id}/profile`, {
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
  const { isLoading, data: user } = useQuery({
    queryKey: ["userById"],
    queryFn: getUserByIdReq,
  });
  return { user, isLoading };
};

export default useGetUserById;
