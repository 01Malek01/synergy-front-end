import { useAuth } from "@/Context/AuthContext";
import useGetFriends from "@/hooks/api/user/useGetFriends";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card, CardHeader } from "../ui/card";
import ChatPage from "./ChatPage";
import { User } from "types";

export default function Chat() {
  const { user } = useAuth();
  const [friendsState, setFriendsState] = useState<User[]>([]);
  const { friends, isLoading: friendsLoading } = useGetFriends();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openChat, setOpenChat] = useState(false);
  const [newMessages, setNewMessages] = useState<
    { sender: string; content: string }[]
  >([]);

  useEffect(() => {
    if (!friendsLoading) {
      setFriendsState(friends);
    }
  }, [friends, friendsLoading]);

  const removeNotification = (senderId: string) => {
    setNewMessages((prevMessages) =>
      prevMessages.filter((message) => message.sender !== senderId)
    );
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className={cn("w-full-10")}>
          <ChatPage
            selectedUser={selectedUser}
            senderId={user?._id as string}
            setOpenChat={setOpenChat}
            openChat={openChat}
          />
          <div className={cn("users-container", openChat ? "hidden" : "")}>
            <h1 className="font-thin text-2xl mb-10 text-center">Chats</h1>
            <div className="users">
              {friendsLoading ? (
                <div className="flex justify-center items-center">
                  <span>Loading friends...</span>
                </div>
              ) : friendsState?.length > 0 ? (
                friendsState
                  ?.filter((u: User) => u?._id !== user?._id)
                  .map((friend: User) => (
                    <Card
                      key={friend?._id}
                      onClick={() => {
                        setSelectedUser(friend);
                        setOpenChat(true);
                        removeNotification(friend?._id as string); // Remove notification when opening chat with the user
                      }}
                      className="cursor-pointer my-5 hover:bg-slate-600/10"
                    >
                      <CardHeader>{friend?.name}</CardHeader>
                      <span>
                        {newMessages.some((m) => m.sender === friend?._id)
                          ? "New message"
                          : ""}
                      </span>
                    </Card>
                  ))
              ) : (
                <p className="text-center font-thin mt-32">
                  Friends you follow, and who follow you back, will be available
                  to chat.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
