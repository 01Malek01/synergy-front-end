import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetExplorePeople = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getExplorePeopleReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/explore-people`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { isLoading, data: users } = useQuery({
    queryFn: getExplorePeopleReq,
    queryKey: ["explore-people"],
  });

  return { users, isLoading };
};

export default useGetExplorePeople;
