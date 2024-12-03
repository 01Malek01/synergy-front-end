import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useCreateComment = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // The mutation request function
  const createCommentReq = async (data: {
    postId: string;
    content: string;
  }) => {
    try {
      // Post the comment to the backend
      const response = await axios.patch(
        `${backendUrl}/posts/${data.postId}/comment`,
        { content: data.content }, // Send data as an object
        { withCredentials: true }
      );
      return response.data.comment;
    } catch (err) {
      console.error(err); // Handle error
    }
  };

  // Use mutation with React Query
  const { mutateAsync: createComment } = useMutation({
    mutationFn: createCommentReq,
    mutationKey: ["createComment"], // Mutation key
  });

  return { createComment }; // Return the mutation function
};

export default useCreateComment;
