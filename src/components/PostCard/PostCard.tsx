import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate } from "@/utils";
import { SlLike } from "react-icons/sl";
import { FaRegShareSquare, FaRegCommentAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useLike from "@/hooks/api/post/useLike";
import useDislike from "@/hooks/api/post/useDislike";
import Comments from "../Comments/Comments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import useSharePost from "@/hooks/api/post/useSharePost";
import { toast } from "react-toastify";

// Define the props type
type Props = {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  likes: string[];
  postId: string;
  authorId: string;
  likesCount?: number;
  isShared?: boolean;
  sharedFrom?: string;
};

export default function PostCard({
  title,
  content,
  author,
  publishDate,
  likes,
  postId,
  authorId,
  isShared,
  sharedFrom,
}: Props) {
  const [liked, setLiked] = useState(false);
  const { likePost } = useLike();
  const { dislikePost } = useDislike();
  const [postLikes, setPostLikes] = useState(likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { isError, sharePost, isSuccess } = useSharePost();

  // Function to handle sharing a post
  const sharePostHandler = () => {
    if (authUser) {
      sharePost({ postId: postId || "" });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Post shared successfully");
    }
    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (authUser && likes.includes(authUser._id as string)) {
      setLiked(true);
    }
  }, [authUser, likes]);

  return (
    <Card className="w-full p-6 rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out mb-8">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </CardTitle>
        <CardDescription
          onClick={() => navigate(`/users/${authorId}/profile`)}
          className="text-sm md:text-base font-medium text-gray-500 mt-1 cursor-pointer hover:underline"
        >
          {author}
          {isShared && (
            <span className="text-sm font-thin text-gray-400">
              {" "}
              shared a post from {sharedFrom}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-gray-700 text-base md:text-lg mt-4 leading-relaxed">
        {content}
      </CardContent>

      <CardFooter className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-400">
          Published {formatDate(publishDate)}
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setLiked((prev) => !prev);
              if (liked) {
                setPostLikes((prev) => prev - 1);
                dislikePost(postId);
              } else {
                setPostLikes((prev) => prev + 1);
                likePost(postId);
              }
            }}
            className={cn(
              "flex items-center gap-2 text-gray-600 hover:text-app_primary transition-colors",
              { "text-app_primary": liked }
            )}
          >
            <SlLike size={20} />
            <span>{postLikes}</span>
          </button>
          <button
            onClick={sharePostHandler}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <FaRegShareSquare size={20} />
          </button>
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
          >
            <FaRegCommentAlt size={20} />
          </button>
        </div>
      </CardFooter>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 p-4 rounded-md border border-gray-200 bg-gray-50">
          <Comments postId={postId} />
        </div>
      )}
    </Card>
  );
}
