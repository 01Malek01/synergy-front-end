import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { IoEyeSharp } from "react-icons/io5";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSignup from "@/hooks/api/auth/useSignup";
import useGoogleLogin from "@/hooks/api/auth/useGoogleLogin";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Define the schema using zod
const formSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Define the SignupForm component
const SignupForm = ({
  overlayMove,
  backendUrl,
}: {
  overlayMove: boolean;
  backendUrl: string;
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSuccess } = useSignup();
  const { googleLogin } = useGoogleLogin();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  // Update the handleSignup function to match the schema
  const handleSignup = (data: {
    username: string; // Changed from 'name' to 'username'
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    signup(data);
    if (isSuccess) {
      navigate("/auth");
    }
  };

  return (
    <div
      className={cn(
        "flex-1 h-full p-10 pt-auto flex items-center z-10 sign-up flex-col shadow-xl md:shadow-none w-full",
        {
          flex: !overlayMove,
          hidden: overlayMove,
        }
      )}
    >
      <Form {...form}>
        <motion.form
          transition={{ duration: 0.5, ease: "easeInOut" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="w-full flex items-center justify-center gap-5 flex-col"
          onSubmit={handleSubmit(handleSignup)}
        >
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Enter your username"
                  />
                </FormControl>
                <FormMessage>{errors.username?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
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
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      placeholder="Confirm your password"
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
                <FormMessage>{errors.confirmPassword?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button
            className="w-1/2 bg-app_primary hover:bg-blue-700"
            type="submit"
          >
            Sign Up
          </Button>
        </motion.form>
      </Form>
      <motion.div
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        className="text-center flex items-center gap-5"
      >
        <Button
          className="bg-white rounded-full px-4 py-2 text-black hover:bg-gray-200 mt-5"
          onClick={() => {
            window.location.href = `${backendUrl}/auth/login/federated/google`;
            googleLogin();
          }}
        >
          <FcGoogle size={24} className="mr-2" />
          Continue with Google
        </Button>
      </motion.div>
    </div>
  );
};

export default SignupForm;
