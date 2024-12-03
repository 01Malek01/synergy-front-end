import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import useGetPostComments from "@/hooks/api/post/useGetPostComments";
import useCreateComment from "@/hooks/api/post/useCreateComment";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { PostComment } from "types";
import { formatDate } from "@/utils";
import { useAuth } from "@/Context/AuthContext";
import { cn } from "@/lib/utils";
import useDeleteComment from "@/hooks/api/post/useDeleteComment";
import { toast } from "react-toastify";

export default function Comments({ postId }: { postId: string }) {
  // Fetch comments using the custom hook
  const { comments, isLoading: isCommentsLoading } = useGetPostComments(postId);
  const { createComment } = useCreateComment();
  const { user } = useAuth();
  const {
    deleteComment,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    isPending: isDeletePending,
  } = useDeleteComment();

  // Initialize post comments state with the fetched comments or an empty array
  const [postComments, setPostComments] = useState<PostComment[]>([]);

  // Update the state with fetched comments when the `comments` change
  useEffect(() => {
    if (comments) {
      setPostComments(comments.comments);
    }
  }, [comments]);
  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Comment deleted successfully");
    }
    if (isDeleteError) {
      toast.error("Failed to delete comment");
    }
    if (isDeletePending) {
      toast.info("Deleting comment...");
    }
    return () => toast.dismiss();
  });
  // Validation schema for comments
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CommentSchema = z.object({
    comment: z
      .string()
      .min(3, { message: "Comment must be at least 3 characters" })
      .max(200, { message: "Comment must be less than 200 characters" }),
  });

  const form = useForm<z.infer<typeof CommentSchema>>();
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = form;

  // Post new comment and append it to the existing comments state
  const postComment = async (data: z.infer<typeof CommentSchema>) => {
    const newComment = await createComment({
      postId,
      content: data.comment,
    });

    if (newComment) {
      // Append the new comment to the current comments list
      setPostComments((prevComments) => [...prevComments, newComment]);
    }

    // Reset the form after submitting the comment
    reset();
  };
  const deleteCommentClick = async (commentId: string) => {
    await deleteComment({
      postId,
      commentId,
    });

    if (isDeleteSuccess) {
      setPostComments((prevComments) =>
        prevComments.filter(
          (comment) => comment._id.toString() !== commentId.toString()
        )
      );
    }
  };

  return (
    <div className="wrapper w-full">
      <div className="post-comment w-full">
        <Form {...form}>
          <form className=" " onSubmit={handleSubmit(postComment)}>
            <FormItem>
              <FormField
                name="comment"
                render={() => (
                  <textarea
                    {...register("comment")}
                    name="comment"
                    id="comment"
                    className=" w-full md:w-1/2 h-24 outline-none border-b-2 border-slate-500"
                    placeholder="Write a comment"
                  ></textarea>
                )}
              />
            </FormItem>
            <FormMessage>
              <p>{errors.comment?.message}</p>
            </FormMessage>
            <Button type="submit">Post</Button>
          </form>
        </Form>
      </div>

      <p className="text-md font-thin my-10">Comments</p>

      {isCommentsLoading ? (
        <p>Loading...</p>
      ) : (
        postComments.map((comment: PostComment) => (
          <div
            key={comment?._id}
            className="relative w-full md:w-1/2 self-start rounded-sm bg-slate-300/60 p-2 my-10 flex flex-col gap-2"
          >
            <div className="flex items-center flex-row ">
              <span
                onClick={() => deleteCommentClick(comment?._id)}
                className={cn(
                  "order-1 text-sm hover:text-red-400 text-red-600 underline cursor-pointer self-end ml-auto hidden",
                  {
                    block: user?._id === comment?.author,
                  }
                )}
              >
                Delete
              </span>
              <span className="text-xs font-thin">
                {user?._id === comment?.author ? "You" : comment?.authorName}
              </span>
            </div>
            {/* Comment content */}
            <p className="font-semibold text-lg">{comment?.content}</p>
            <span className="text-xs font-thin self-end">
              {formatDate(comment?.createdAt)}
            </span>

            {/* The tip (pseudo-element simulation) */}
            <div className="absolute top-[0.7rem] -left-1 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] rotate-[-90deg] border-b-slate-300/60"></div>
          </div>
        ))
      )}
    </div>
  );
}
