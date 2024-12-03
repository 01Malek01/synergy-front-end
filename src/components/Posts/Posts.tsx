import { useEffect } from "react";
import PostCard from "../PostCard/PostCard";
import { usePosts } from "@/Context/PostsContext";
import { Post } from "types";

function Posts() {
  const { posts, setPosts, isLoading } = usePosts() ?? {
    posts: [],
    isLoading: true,
    setPosts: () => {},
  };
  useEffect(() => {
    if (!isLoading) {
      setPosts(posts);
    }
  }, [posts, isLoading, setPosts]);

  if (isLoading)
    return (
      <div className="loading text-4xl text-center mt-20 font-semibold">
        Loading...
      </div>
    );
  return (
    <div className="posts h-screen m-5">
      <h1 className="font-thin text-2xl mb-10 text-center">Latest Posts</h1>
      {posts.map((post: Post) => (
        <PostCard
          key={post._id}
          title={post.title}
          content={post.content}
          author={post?.author?.name}
          authorId={post?.author?._id}
          publishDate={post.createdAt}
          likes={post?.likes}
          postId={post._id}
          isShared={post?.isShared}
          sharedFrom={post?.sharedFrom?.name}
        />
      ))}
    </div>
  );
}

export default Posts;
