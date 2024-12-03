import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useSendMessage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const sendMessageReq = async (data: {
    content: string;
    receiverId: string;
  }) => {
    const res = await axios.post(
      `${backendUrl}/chat/${data.receiverId}/send-message`,
      {
        content: data.content,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  };
  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: sendMessageReq,
    mutationKey: ["sendMessage"],
  });
  return { sendMessage };
};

export default useSendMessage;
