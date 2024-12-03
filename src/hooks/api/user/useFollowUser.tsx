import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useFollowUser = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const followUserReq = async (data: { userId: string }) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/user/${data.userId}/follow`,
        {},
        {
          withCredentials: true,
        }
      );
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
  const { mutateAsync: followUser, isSuccess } = useMutation({
    mutationFn: followUserReq,
    mutationKey: ["follow"],
  });
  return { followUser, isSuccess };
};

export default useFollowUser;
