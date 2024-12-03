import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { AxiosError } from "types";

const useGetAllPosts = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getAllPostsReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/posts`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err: unknown) {
      // Cast the error to AxiosError if it matches the shape
      const axiosError = err as AxiosError;

      if (axiosError.response) {
        // Handle errors from the server
        toast.error(axiosError.response.data.message || "An error occurred");
      } else if (axiosError.request) {
        // Handle errors with the request
        toast.error("No response received from the server");
      } else {
        // Handle other errors
        toast.error(axiosError.message || "An unexpected error occurred");
      }
      // Return an empty array or handle as per your requirement
      return [];
    }
  };

  const { data: posts, isLoading } = useQuery({
    queryFn: getAllPostsReq,
    queryKey: ["posts"],
    refetchIntervalInBackground: true,
    refetchInterval: 30000,
  });

  return { posts, isLoading };
};

export default useGetAllPosts;
