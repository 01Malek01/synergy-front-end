import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useCreatePost from "@/hooks/api/post/useCreatePost";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Textarea } from "../ui/textarea";

function CreatePost() {
  const { createPost, isPending, isSuccess, isError } = useCreatePost();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchema = z.object({
    title: z.string().min(3, "Title is required"),
    content: z.string().min(3, "Content is required").max(300, "Too long"),
  });
  const form = useForm<z.infer<typeof formSchema>>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const publishPost = async (data: z.infer<typeof formSchema>) => {
    await createPost(data);
  };
  useEffect(() => {
    if (isSuccess) {
      form.reset();
      toast.success("Post Created Successfully");
    }

    if (isError) {
      toast.error("Something went wrong");
    }
  }, [isSuccess, isError, isPending, form]);
  return (
    <div className="create-post p-5 outline-4 outline-cyan-700 w-full h-96 mb-14">
      <h1 className="font-semibold text-2xl"> Create A Post</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(publishPost)}>
          <FormField
            name="title"
            render={() => (
              <FormItem className="w-1/2">
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  placeholder="What would you like to share?"
                  {...register("title")}
                />
                <FormMessage>{errors.title?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="content"
            render={() => (
              <FormItem className="">
                <FormLabel>Content</FormLabel>
                <Textarea
                  {...register("content")}
                  placeholder="What would you like to share?"
                  className="w-full h-32 text-lg px-4 py-2 border border-gray-300 rounded-lg"
                  maxLength={300} 
                />
                <FormMessage>{errors.content?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-app_primary mt-1 hover:bg-blue-700"
          >
            Post
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreatePost;
