import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useSharePost = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const sharePostReq = async (data: { postId: string }) => {
    const res = await axios.post(`${backendUrl}/posts/${data.postId}/share`, {
      withCredentials: true,
    });

    return res.data;
  };

  const {
    mutateAsync: sharePost,
    isSuccess,
    isError,
    isPending,
  } = useMutation({
    mutationFn: sharePostReq,
    mutationKey: ["sharePost"],
  });

  return { sharePost, isSuccess, isError, isPending };
};

export default useSharePost;
