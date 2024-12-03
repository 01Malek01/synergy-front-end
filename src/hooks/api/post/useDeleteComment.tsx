import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useDeleteComment = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const deleteCommentReq = async (data: {
    postId: string;
    commentId: string;
  }) => {
    const res = await axios.delete(
      `${backendUrl}/posts/${data.postId}/comment/${data.commentId}`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  };
  const {
    mutateAsync: deleteComment,
    isSuccess,
    isError,
    isPending,
  } = useMutation({
    mutationFn: deleteCommentReq,
    mutationKey: ["deleteComment"],
  });
  return { deleteComment, isSuccess, isError, isPending };
};

export default useDeleteComment;
