import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetFriends = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getFriendsReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/friends`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { isLoading, data: friends } = useQuery({
    queryFn: getFriendsReq,
    queryKey: ["friends"],
  });

  return { friends, isLoading };
};

export default useGetFriends;
