import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useUnFollowUser = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const unFollowUserReq = async (data: { userId: string }) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/user/${data.userId}/unfollow`,
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
  const { mutateAsync: unFollowUser, isSuccess } = useMutation({
    mutationFn: unFollowUserReq,
    mutationKey: ["unfollow"],
  });
  return { unFollowUser, isSuccess };
};

export default useUnFollowUser;
