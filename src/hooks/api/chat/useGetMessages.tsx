import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetMessages = (receiverId: string) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getMessagesReq = async () => {
    if (receiverId === "" || receiverId === undefined || receiverId === null) {
      return;
    }
    try {
      const res = await axios.get(`${backendUrl}/chat/${receiverId}/messages`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { isLoading, data: messages } = useQuery({
    queryFn: getMessagesReq,
    queryKey: ["messages", receiverId],
  });

  return { messages, isLoading };
};
export default useGetMessages;
