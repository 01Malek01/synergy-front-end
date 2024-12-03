import { useEffect, useState } from "react";
// import { cn } from "../../lib/utils";
import { IoMdCloseCircle } from "react-icons/io";
import useGetUserById from "@/hooks/api/user/useGetUserById";
import { toast } from "react-toastify";
import { useAuth } from "@/Context/AuthContext";
import FollowButton from "@/components/FollowButton/FollowButton";
import useGetPostsByUser from "@/hooks/api/post/useGetPostsByUser";
import PostCard from "@/components/PostCard/PostCard";
import { Post } from "types";

function UserProfile() {
  const [showPhoto, setShowPhoto] = useState(false);
  const { user, isLoading } = useGetUserById();
  const [userState, setUserState] = useState(user);
  const { user: authUser } = useAuth();
  const [followed, setFollowed] = useState(false);
  const { posts } = useGetPostsByUser(userState?._id);

  useEffect(() => {
    if (isLoading) toast.info("Loading...");
    setUserState(user);
    return () => toast.dismiss();
  }, [user, isLoading, posts]);
  useEffect(() => {
    if (authUser) {
      if (user?.followers?.includes(authUser._id)) {
        setFollowed(true);
      } else {
        setFollowed(false);
      }
    }
  }, [authUser, user]);
  // const followHandler = async () => {
  //   if (authUser) {
  //     if (followed) {
  //       await unFollowUser({
  //         userId: userState?._id,
  //       });
  //       setFollowed(false);
  //     } else {
  //       await followUser({
  //         userId: userState?._id,
  //       });
  //       setFollowed(true);
  //     }
  //   }
  // };
  return (
    <div className="wrapper p-10 mt-10 bg-gray-100 rounded-lg shadow-lg">
      <div className="container flex flex-col gap-8 w-full">
        {/* Upper Section */}
        <div className="upper flex flex-col items-center justify-center gap-8">
          <span className="username text-4xl font-bold text-gray-800 group cursor-pointer flex items-center justify-center gap-2">
            {userState?.name}
          </span>

          {/* Profile Image */}
          <div
            onClick={() => setShowPhoto(true)}
            className="profile-image w-48 h-48 flex justify-center rounded-full relative cursor-pointer group overflow-hidden shadow-md"
          >
            <img
              src={userState?.profilePic || "/default-profile.jpg"}
              alt="profile"
              className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Show Full Photo Modal */}
          {showPhoto && (
            <div className="show-photo flex w-full h-screen items-center justify-center fixed top-0 left-0 z-50 bg-black/70">
              <span
                onClick={() => setShowPhoto(false)}
                className="close absolute top-8 right-8 text-white text-4xl cursor-pointer hover:scale-125 transition-transform duration-300"
              >
                <IoMdCloseCircle size={50} />
              </span>
              <img
                src={userState?.profilePic || "/default-profile.jpg"}
                alt="profile"
                className="rounded-lg shadow-lg max-w-[80%] max-h-[80%]"
              />
            </div>
          )}
        </div>

        {/* Followers, Following, and Follow Button */}
        <div className="flex items-center justify-center gap-10 text-center mt-5">
          <div className="followers">
            <span className="text-2xl font-bold text-gray-800">
              {userState?.followers?.length || 0}
            </span>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div className="following">
            <span className="text-2xl font-bold text-gray-800">
              {userState?.following?.length || 0}
            </span>
            <p className="text-sm text-gray-600">Following</p>
          </div>

          <FollowButton
            targetUserId={userState?._id}
            followed={followed}
            setFollowed={setFollowed}
          />
        </div>

        {/* Divider */}
        <div className="divider w-full h-[1px] bg-gray-300 my-6"></div>

        {/* Bio Section */}
        <div className="lower flex flex-col gap-6">
          {userState?.bio && (
            <span className="text-2xl font-semibold text-center text-gray-800">
              Bio
            </span>
          )}
          <p className="bio text-center text-gray-600 text-lg leading-relaxed">
            {userState?.bio || "No bio available."}
          </p>
        </div>

        {/* User Posts */}
        <div className="user-posts mt-10">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            {userState?.name}'s Posts
          </h1>
          {posts?.length ? (
            posts.map((post: Post) => (
              <PostCard
                key={post._id}
                author={userState?.name}
                authorId={userState?._id}
                postId={post._id}
                title={post.title}
                content={post.content}
                likes={post.likes}
                publishDate={post.createdAt}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
