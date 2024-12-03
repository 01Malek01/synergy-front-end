const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const useLogin = () => {
  const navigate = useNavigate();
  const loginReq = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${backendUrl}/auth/login`, data, {
        withCredentials: true,
      });
      if (res.statusText !== "OK") {
        throw new Error("Either email or password is incorrect");
      }
      navigate("/");
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`${err.response?.data.message}`);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  const { mutateAsync: login, isSuccess } = useMutation({
    mutationFn: loginReq,
  });
  return { login, isSuccess };
};

export default useLogin;
