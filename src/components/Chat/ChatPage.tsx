import { useAuth } from "@/Context/AuthContext";
import useGetMessages from "@/hooks/api/chat/useGetMessages";
import useSendMessage from "@/hooks/api/chat/useSendMessage";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Form, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useSocket } from "@/Context/SocketContext";
import { User } from "types";

interface ChatPageProps {
  selectedUser: User | null;
  setOpenChat: (open: boolean) => void;
  openChat: boolean;
  senderId: string;
}

interface Message {
  sender: string;
  content: string;
}

export default function ChatPage({
  selectedUser,
  setOpenChat,
  openChat,
}: ChatPageProps) {
  const form = useForm<{ message: string }>({ defaultValues: { message: "" } });
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { user: authUser } = useAuth();
  const { handleSubmit, register, reset } = form;
  const { sendMessage } = useSendMessage();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch messages when opening the chat
  useEffect(() => {
    if (openChat && selectedUser) {
      const fetchMessages = async () => {
        try {
          const { messages: fetchedMessages } = useGetMessages(
            selectedUser._id
          );
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [openChat, selectedUser]);

  // Send a message and update the state
  const sendMessageHandler = async (data: { message: string }) => {
    reset();
    try {
      const res = await sendMessage({
        receiverId: selectedUser?._id as string,
        content: data.message,
      });
      setMessages((prev) => [...prev, res.message]);
      scrollIntoView();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle receiving a new message via the socket
  useEffect(() => {
    const handleReceiveMessage = (message: { newMessage: Message }) => {
      setMessages((prev) => [...prev, message.newMessage]);
    };

    socket?.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket?.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);

  // Scroll to the bottom when messages change
  const scrollIntoView = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollIntoView();
  }, [messages]);

  return (
    openChat && (
      <div className="flex flex-col gap-4 relative bg-gray-100 p-4 rounded-lg shadow-md max-w-4xl mx-auto h-[80vh]">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-300">
          <h1 className="font-semibold text-xl">
            Chatting with{" "}
            <span className="text-app_primary font-bold">
              {selectedUser?.name}
            </span>
          </h1>
          <Button
            variant="outline"
            className="opacity-80"
            onClick={() => setOpenChat(false)}
          >
            Back
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col gap-3 overflow-y-auto flex-grow">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No messages yet.
            </div>
          ) : (
            messages.map((message, index) => (
              <Card
                key={index}
                className={cn("p-3 max-w-xs", {
                  "bg-blue-500 text-white self-end rounded-bl-lg rounded-tl-lg rounded-tr-3xl":
                    message.sender === authUser?._id,
                  "bg-gray-200 text-black self-start rounded-br-lg rounded-tl-lg rounded-tr-3xl":
                    message.sender !== authUser?._id,
                })}
              >
                <p className="text-sm">{message?.content}</p>
              </Card>
            ))
          )}
          <div ref={messagesEnd}></div>
        </div>

        {/* Message Input */}
        <Form {...form}>
          <form
            onSubmit={handleSubmit(sendMessageHandler)}
            className="flex items-center gap-3"
          >
            <FormItem className="flex-1">
              <FormField
                name="message"
                render={() => (
                  <Textarea
                    className="w-full"
                    {...register("message")}
                    placeholder="Type something..."
                  />
                )}
              />
            </FormItem>
            <Button type="submit" className="p-2 rounded-full bg-blue-500">
              <IoSend className="text-white text-xl" />
            </Button>
          </form>
        </Form>
      </div>
    )
  );
}
