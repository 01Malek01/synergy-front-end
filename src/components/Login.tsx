import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import useLogin from "@/hooks/api/auth/useLogin";
import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { useState } from "react";
// import { toast } from "react-toastify";

const LoginForm = ({ overlayMove }: { overlayMove: boolean }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useLogin();
  // const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data);
  };

  return (
    <div
      className={cn(
        "flex-1 h-full p-10 pt-auto flex items-center z-10 m-5 w-full shadow-xl md:shadow-none",
        {
          flex: overlayMove,
          hidden: !overlayMove,
        }
      )}
    >
      <Form {...form}>
        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full flex items-center justify-center gap-5 flex-col"
          onSubmit={handleSubmit(handleLogin)}
        >
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      placeholder="Enter your password"
                    />
                    <IoEyeSharp
                      className={cn(
                        "absolute right-3 top-[2.6rem] -translate-y-1/2 cursor-pointer",
                        {
                          "bg-app_primary rounded-full ": showPassword,
                        }
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </>
                </FormControl>
                <FormMessage>{errors.password?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button
            className="w-1/2 bg-app_primary hover:bg-blue-700"
            type="submit"
          >
            Login
          </Button>
        </motion.form>
      </Form>
    </div>
  );
};

export default LoginForm;
