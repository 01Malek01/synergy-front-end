import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useDeletePost = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const deletePostReq = async (data: { postId: string }) => {
    const res = await axios.delete(`${backendUrl}/posts/${data.postId}`, {
      withCredentials: true,
    });

    return res.data;
  };
  const {
    mutateAsync: deletePost,
    isSuccess,
    isError,
    isPending,
  } = useMutation({
    mutationFn: deletePostReq,
    mutationKey: ["deletePost"],
  });
  return { deletePost, isSuccess, isError, isPending };
};

export default useDeletePost;
