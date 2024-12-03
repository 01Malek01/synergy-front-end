import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetAllUsers = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getAllUsersReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/all-users`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { isLoading, data: users } = useQuery({
    queryFn: getAllUsersReq,
    queryKey: ["users"],
  });

  return { users, isLoading };
};

export default useGetAllUsers;
