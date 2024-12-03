import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useDislike = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dislikePostReq = async (postId: string) => {
    await axios
      .patch(
        `${backendUrl}/posts/${postId}/dislike`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const { mutateAsync: dislikePost } = useMutation({
    mutationFn: dislikePostReq,
    mutationKey: ["dislikePost"],
  });
  return { dislikePost };
};

export default useDislike;
