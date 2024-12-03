import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useEditProfile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const editProfileReq = async (data: { name: string; bio: string }) => {
    try {
      const res = await axios.put(
        `${backendUrl}/user/profile`,
        {
          name: data?.name,
          bio: data?.bio,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const {
    mutateAsync: editProfile,
    isSuccess,
    isPending,
  } = useMutation({
    mutationFn: editProfileReq,

    onError: () => {
      toast.error("Profile update failed. Please try again");
    },
  });

  return { editProfile, isSuccess, isPending };
};
export default useEditProfile;
