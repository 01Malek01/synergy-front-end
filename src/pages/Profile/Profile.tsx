import { FaFileUpload, FaPen } from "react-icons/fa";
import { useAuth } from "@/Context/AuthContext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useUploadProfilePic } from "@/hooks/api/user/useUploadProfilePic";
import { cn } from "../../lib/utils";
import useGetUserPosts from "@/hooks/api/user/useGetUserPosts";
import PostCard from "@/components/PostCard/PostCard";
import { Post, User } from "types"; // Ensure that 'types' has the correct exports
import useEditProfile from "@/hooks/api/user/useEditProfile";

function Profile() {
  const { user, setUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const { uploadProfilePic, isPending } = useUploadProfilePic();
  const [file, setFile] = useState<File | null>(null); // Use File type for file
  const { userPosts, isLoading: isLoadingPosts } = useGetUserPosts();
  const [userPostsState, setUserPostsState] = useState<Post[]>([]);
  const {
    editProfile,
    isPending: isPendingEdit,
    isSuccess: isSuccessEdit,
  } = useEditProfile();

  useEffect(() => {
    if (userPosts && !isLoadingPosts) {
      setUserPostsState(userPosts);
    }
  }, [userPosts, isLoadingPosts]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const inputSchema = z.object({
    name: z.string().min(3, "Username must be at least 3 characters long"),
    bio: z.string().optional(),
  });

  const form = useForm<z.infer<typeof inputSchema>>({
    defaultValues: {
      name: user?.name,
      bio: user?.bio,
    },
    resolver: zodResolver(inputSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const saveName = async (data: z.infer<typeof inputSchema>) => {
    // Ensure bio is defined; if it's undefined, provide a default empty string
    const bioToSave = user?.bio ?? ""; // Use nullish coalescing to provide default value
    await editProfile({ name: data.name, bio: bioToSave });
    setUser((prevUser: User) => ({ ...prevUser, name: data.name }));
  };

  const saveBio = async (data: z.infer<typeof inputSchema>) => {
    // Ensure name is defined; if it's undefined, provide a default empty string
    const nameToSave = user?.name ?? ""; // Use nullish coalescing to provide default value
    await editProfile({ name: nameToSave, bio: data.bio || "" }); // Handle possible undefined bio
    setUser((prevUser: User) => ({ ...prevUser, bio: data.bio || "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null; // Use optional chaining for safer access
    if (selectedFile) {
      setFile(selectedFile);
      const formData = new FormData();
      formData.append("profilePic", selectedFile);
      uploadProfilePic(formData);
    }
  };

  useEffect(() => {
    if (isSuccessEdit) {
      toast.success("Profile updated successfully");
      setIsEditingName(false);
      setIsEditingBio(false);
    }
  }, [isSuccessEdit]);

  useEffect(() => {
    if (isPendingEdit) {
      toast.info("Saving...");
    }
    return () => toast.dismiss();
  }, [isPendingEdit]);

  return (
    <div className="wrapper p-10 mt-10 bg-app_surface">
      <div className="container flex flex-col gap-10 w-full max-w-4xl mx-auto">
        <div className="upper flex flex-col items-center justify-center gap-10">
          {/* Edit Name */}
          {isEditingName ? (
            <form
              onSubmit={handleSubmit(saveName)}
              className="flex gap-3 items-center"
            >
              <input
                {...register("name")}
                type="text"
                className="outline-none border-b-2 border-gray-300 focus:border-app_primary transition w-64 text-lg p-1"
              />
              <button
                type="submit"
                className="save bg-app_primary text-white px-4 py-2 rounded-md shadow-md hover:bg-app_primary_dark transition"
              >
                Save
              </button>
            </form>
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              className="username text-3xl font-semibold group cursor-pointer flex items-center gap-2"
            >
              {user?.name}
              <FaPen
                size={15}
                className="edit opacity-0 group-hover:opacity-100 transition"
              />
            </span>
          )}

          {/* Profile Image */}
          <div className="profile-image w-[200px] h-[200px] text-center flex justify-center rounded-full relative cursor-pointer group overflow-hidden">
            <div
              onClick={() => document?.getElementById("file-upload")?.click()}
              className={cn(
                "profile-image-overlay absolute h-full w-full top-0 left-0 bg-black/50 rounded-full items-center justify-center hidden group-hover:flex transition"
              )}
            >
              <FaFileUpload size={40} className="text-white" />
              <form encType="multipart/form-data" className="hidden">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button type="submit" id="upload-btn" className="hidden">
                  Upload
                </button>
              </form>
            </div>
            {isPending ? (
              <div className="loader w-full h-full flex items-center justify-center bg-gray-200 rounded-full animate-pulse"></div>
            ) : (
              <img
                src={user?.profilePic || "/logo.jpg"}
                alt="profile"
                className="rounded-full shadow-md object-cover w-full h-full"
              />
            )}
          </div>

          {/* Followers and Following */}
          <div className="flex items-center justify-around gap-10 text-center">
            <div className="followers">
              <span className="text-2xl font-semibold text-app_primary">
                {user?.followers?.length || 0}
              </span>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="following">
              <span className="text-2xl font-semibold text-app_primary">
                {user?.following?.length || 0}
              </span>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
        </div>

        <div className="divider w-full h-[1px] bg-gray-200 my-6"></div>

        {/* Edit Bio */}
        <div className="lower flex flex-col gap-6">
          <span className="text-2xl font-semibold text-center">Bio</span>
          {isEditingBio ? (
            <form
              onSubmit={handleSubmit(saveBio)}
              className="flex flex-col items-center gap-3"
            >
              <textarea
                {...register("bio")}
                className="w-full max-w-lg h-24 border border-gray-300 rounded-md p-3 outline-none focus:border-app_primary transition resize-none"
              />
              <button
                type="submit"
                className="save bg-app_primary text-white px-4 py-2 rounded-md shadow-md hover:bg-app_primary_dark transition"
              >
                Save
              </button>
            </form>
          ) : (
            <p
              onClick={() => setIsEditingBio(true)}
              className="bio text-center tracking-tight text-gray-600 font-medium group cursor-pointer flex items-center justify-center gap-2"
            >
              {user?.bio || "Click to add a bio"}
              <FaPen
                size={15}
                className="edit opacity-0 group-hover:opacity-100 transition"
              />
            </p>
          )}
        </div>

        {/* User Posts */}
        <div className="user-posts mt-10">
          <h1 className="text-3xl font-semibold text-center mb-10">
            Your Posts
          </h1>
          {isLoadingPosts ? (
            <div className="loader font-bold text-3xl text-center animate-pulse">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPostsState.map((post: Post) => (
                <PostCard
                  authorId={post.author?._id}
                  key={post._id}
                  title={post.title}
                  content={post.content}
                  author={post.author?.name}
                  publishDate={post.createdAt}
                  likes={post.likes}
                  postId={post._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
