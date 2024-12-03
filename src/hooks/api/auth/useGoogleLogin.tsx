const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const useGoogleLogin = () => {
  const navigate = useNavigate();
  const loginReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/auth/login/federated/google`, {
        withCredentials: true,
      });
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
  const { mutateAsync: googleLogin, isPending } = useMutation({
    mutationFn: loginReq,
    onSuccess: () => {
      toast.success("Login Successful");
      navigate("/");
    },
    onError: () => {
      toast.error("Login Failed. Please try again");
    },
  });
  return { googleLogin, isPending };
};

export default useGoogleLogin;
