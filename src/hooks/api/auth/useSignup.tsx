const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const useSignup = () => {
  const navigate = useNavigate();
  const signupReq = async (data: {
    email: string;
    password: string;
    username: string;
  }) => {
    try {
      const res = await axios.post(
        `${backendUrl}/auth/register`,
        {
          email: data.email,
          password: data.password,
          name: data.username,
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
  const { mutateAsync: signup, isSuccess } = useMutation({
    mutationFn: signupReq,
    onSuccess: () => {
      navigate("/");
    },
    onError: () => {
      toast.error("Signup Failed. Please try again");
    },
  });
  return { signup, isSuccess };
};

export default useSignup;
