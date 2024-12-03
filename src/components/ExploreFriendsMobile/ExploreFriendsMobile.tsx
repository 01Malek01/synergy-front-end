import { motion } from "framer-motion";
import FollowButton from "../FollowButton/FollowButton";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { AuthUser, User } from "types";
import dayjs from "dayjs";

type Props = {
  menuOpen: boolean;
  users: User[];
  isLoading: boolean;
  authUser: AuthUser;
  followed: boolean;
  setFollowed: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ExploreFriendsMobile({
  menuOpen,
  users,
  isLoading,
  authUser,
  followed,
  setFollowed,
}: Props) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: menuOpen ? "0%" : "-100%" }}
      transition={{ duration: 0.5 }}
      className="fixed  top-0 right-0 h-screen  col-span-8 bg-white  shadow-lg  z-40 lg:translate-x-0 translate-x-full   w-full  "
    >
      <div className="explore-friends my-10 h-full p-4 ">
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
              .map(({ _id, name, followers, createdAt, profilePic }: User) => (
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
              ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
