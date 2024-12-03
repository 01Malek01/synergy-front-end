import Chat from "@/components/Chat/Chat";
import CreatePost from "@/components/CreatePost/CreatePost";
import ExploreFriendsMobile from "@/components/ExploreFriendsMobile/ExploreFriendsMobile";
import FollowButton from "@/components/FollowButton/FollowButton";
import Posts from "@/components/Posts/Posts";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/Context/AuthContext";
import { useNotificationContext } from "@/Context/NotificationContext";
import useGetExplorePeople from "@/hooks/api/user/useGetExplorePeople";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowCircleRight, FaBars } from "react-icons/fa"; // Added FaBars for menu icon
import { IoChatbubbleEllipses } from "react-icons/io5";
import "react-resizable/css/styles.css"; // Import the necessary styles for resizing
import { User } from "types";

function Home() {
  const [collapseChat, setCollapseChat] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { user: authUser } = useAuth();
  const { users: fetchedUsers, isLoading } = useGetExplorePeople();
  const [followed, setFollowed] = useState(false);
  const { messageNotification } = useNotificationContext();
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  useEffect(() => {
    if (users && users.length > 0) {
      users.forEach((user) => {
        if (user?.followers?.includes(authUser?._id as string)) {
          setFollowed(true);
        }
      });
    }
  }, [users, authUser]);

  return (
    <div className="wrapper px-5 relative  min-h-screen overflow-x-hidden ">
      <div className="container grid grid-cols-8 gap-4 min-h-screen ">
        {/* First column - Create Post and Posts */}
        <div
          className={cn(
            "lg:col-span-6 col-span-8 flex flex-col items-center justify-start gap-4 h-screen py-5"
          )}
        >
          <div className="create-post-posts-container w-full flex flex-col items-center gap-4 h-full   min-h-fit max-h-screen ">
            <div className="create-post w-full lg:w-1/2">
              <CreatePost />
            </div>
            <div className="posts w-full">
              <Posts />
            </div>
          </div>
        </div>
        {/* Second column - Explore Friends */}
        <div className="explore-friends-lg hidden lg:block col-span-8 lg:col-span-2 my-10 h-full border-l-2 border-gray-300">
          <h1 className="text-2xl font-semibold my-4 text-center">
            Explore More People
          </h1>
          <div className="explore-container flex flex-col justify-center items-center gap-5">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="loader animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              users.length > 0 &&
              users
                ?.filter(({ _id }: User) => _id !== authUser?._id)
                .map(
                  ({ _id, name, followers, createdAt, profilePic }: User) => (
                    <Card
                      key={_id}
                      className="p-4 shadow-md rounded-lg hover:shadow-lg transition-shadow w-full max-w-xs"
                    >
                      <CardHeader className="text-xl text-center font-semibold text-gray-800 border-b pb-2 mb-4 flex flex-col gap-2">
                        <div>{name}</div>
                        <div className="flex items-center justify-center">
                          <img
                            src={profilePic || "/logo.jpg"}
                            alt="profile pic"
                            className="w-20 h-20 rounded-full"
                          />
                        </div>
                      </CardHeader>
                      <CardFooter className="flex flex-col gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Followers:</span>{" "}
                          {followers?.length || 0}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Joined:</span>{" "}
                          {dayjs(createdAt).format("DD/MM/YYYY")}
                        </div>
                        <FollowButton
                          targetUserId={_id as string}
                          followed={followed}
                          setFollowed={setFollowed}
                        />
                      </CardFooter>
                    </Card>
                  )
                )
            )}
          </div>
        </div>

        {/* explore friends menu for mobile view */}
        {/* Button to open the side menu on mobile */}
        <button
          className="lg:hidden fixed top-10 left-0 z-50 text-3xl text-gray-700"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <FaBars />
        </button>
        <ExploreFriendsMobile
          menuOpen={menuOpen}
          users={users}
          isLoading={isLoading}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          authUser={authUser}
          followed={followed}
          setFollowed={setFollowed}
        />
      </div>

      {/* Chat Section */}
      <motion.div
        animate={{ x: collapseChat ? "100%" : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="lg:w-1/4 w-[90%] h-screen bg-slate-100 rounded-md p-3  top-10 right-0 shadow-md fixed"
      >
        <span className="collapse-chat absolute">
          {collapseChat ? (
            <div className="relative">
              <IoChatbubbleEllipses
                onClick={() => setCollapseChat((prev) => !prev)}
                className="text-3xl cursor-pointer absolute right-0 top-[50%] translate-y-[70%] left-[-40px] text-app_primary scale-x-[-1] hover:scale-x-[-1] transform hover:scale-105 "
              />
              <span
                className={cn(
                  "absolute top-3 right-9 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center",
                  {
                    hidden: messageNotification === 0,
                  }
                )}
              >
                {messageNotification}
              </span>
            </div>
          ) : (
            <FaArrowCircleRight
              onClick={() => setCollapseChat((prev) => !prev)}
              className="text-3xl cursor-pointer absolute right-0 top-[50%] translate-y-[70%] left-[-40px] text-app_primary hover:scale-105"
            />
          )}
        </span>
        <div className="h-1/2">
          <Chat />
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
