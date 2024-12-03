import useGetAllPosts from "@/hooks/api/post/useGetAllPosts";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Post, PostContextValue } from "types";

const PostContext = createContext<PostContextValue | null>(null);
const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);
  const { posts, isLoading } = useGetAllPosts();
  useEffect(() => {
    if (posts) setFetchedPosts(posts);
  }, [posts]);
  return (
    <PostContext.Provider
      value={{ posts: fetchedPosts, setPosts: setFetchedPosts, isLoading }}
    >
      {children}
    </PostContext.Provider>
  );
};
export const usePosts = () => useContext(PostContext);

export default PostsProvider;
