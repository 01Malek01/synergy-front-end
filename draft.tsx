import { useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { Form, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoSend } from "react-icons/io5";
import { cn } from "@/lib/utils";

export default function ChatPage({
  socket,
  senderId,
  otherUserId,
  messages,
}: {
  socket: any;
  senderId: string;
  otherUserId: string;
  messages: any;
}) {
  const form = useForm({ initialValues: { message: "" } });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;
  const sendMessage = function (message: string) {
    socket.emit("privateMessage", {
      senderId,
      receiverId: "66df2444b46be8dba8a3c907",
      content: message,
    });
  };
  return (
    <>
      <div className="flex flex-col ">
        <h1 className="font-thin text-2xl mb-10 text-center">
          You're Chatting with : {otherUserId}
        </h1>
        {messages?.map((message: any, index: number) => (
          <Card key={index} className="sent self-end p-2">
            <p>{message?.content?.message}</p>
          </Card>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(sendMessage)}
          className="flex justify-start fixed bottom-0 w-full items-center"
        >
          <FormItem>
            <FormField
              name="message"
              render={() => (
                <Textarea
                  className="max-w-[500px] min-w-[200px]"
                  {...register("message")}
                  placeholder="Type something"
                />
              )}
            />
          </FormItem>
          <Button className="self-end ml-5 " type="submit">
            <IoSend className="text-2xl" />
          </Button>
        </form>
      </Form>
    </>
  );
}
