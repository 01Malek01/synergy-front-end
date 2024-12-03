import { useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { Form, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoSend } from "react-icons/io5";
import useSendMessage from "@/hooks/api/chat/useSendMessage";
import useGetMessages from "@/hooks/api/chat/useGetMessages";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/Context/AuthContext";
import { Socket } from "socket.io-client";

// Define types for the props
interface SelectedUser {
  name: string;
  _id: string;
  email: string;
  profilePicture: string;
}

interface Message {
  content: string;
  sender: string;
}

interface MobileChatProps {
  socket: Socket;
  senderId: string; // Add type as needed
  selectedUser: SelectedUser;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setOpenChat: (open: boolean) => void;
  openChat: boolean;
}

interface FormValues {
  message: string;
}

export default function MobileChat({
  selectedUser,
  messages,
  setOpenChat,
  openChat,
  setMessages,
}: MobileChatProps) {
  const form = useForm<FormValues>({ defaultValues: { message: "" } });
  const { user: authUser } = useAuth();
  const { handleSubmit, register, reset } = form;
  const { sendMessage } = useSendMessage();
  const { messages: fetchedMessages } = useGetMessages(selectedUser?._id);

  const sendMessageHandler = async (data: FormValues) => {
    reset();
    const res = await sendMessage({
      receiverId: selectedUser?._id,
      content: data.message,
    });
    console.log("res from sending message", res);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    setMessages((prev: Message[]) => [...prev, res.message]);
  };

  useEffect(() => {
    if (fetchedMessages) {
      console.log(
        "fetched messages with user ",
        selectedUser?.name,
        fetchedMessages
      );
      setMessages(fetchedMessages?.messages);
    }
  }, [fetchedMessages, selectedUser?.name, setMessages]);

  return (
    openChat && (
      <>
        <div className="flex flex-col">
          <Button onClick={() => setOpenChat(false)}>Back</Button>
          <h1 className="font-thin text-2xl mb-10 text-center">
            You're Chatting with <br />
            {selectedUser?.name}
          </h1>
          {messages?.map((message, index) => (
            <Card
              key={index}
              className={cn("sent p-2", {
                "self-start bg-app_primary/90":
                  message?.sender === authUser?._id,
                "self-end": message?.sender !== authUser?._id,
              })}
            >
              <p>{message?.content}</p>
            </Card>
          ))}
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(sendMessageHandler)}
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
            <Button className="self-end ml-5" type="submit">
              <IoSend className="text-2xl" />
            </Button>
          </form>
        </Form>
      </>
    )
  );
}
