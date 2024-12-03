import useUnFollowUser from "@/hooks/api/user/useUnfollowUser";
import { Button } from "../ui/button";
import { useAuth } from "@/Context/AuthContext";
import useFollowUser from "@/hooks/api/user/useFollowUser";

type Props = {
  targetUserId: string;
  followed: boolean;
  setFollowed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FollowButton({
  targetUserId,
  followed,
  setFollowed,
}: Props) {
  const { user: authUser } = useAuth();
  const { followUser } = useFollowUser();
  const { unFollowUser } = useUnFollowUser();
  const followHandler = async () => {
    if (authUser) {
      if (followed) {
        await unFollowUser({
          userId: targetUserId,
        });
        setFollowed(false);
      } else {
        await followUser({
          userId: targetUserId,
        });
        setFollowed(true);
      }
    }
  };
  return (
    <>
      {authUser?._id !== targetUserId && (
        <Button onClick={followHandler} className="w-36">
          {followed ? "Unfollow" : "Follow"}
        </Button>
      )}
    </>
  );
}
