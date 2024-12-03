import {
  useContext,
  useEffect,
  useState,
  createContext,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { Notification as NotificationType } from "types";
import { useSocket } from "./SocketContext";
import useGetNotifications from "@/hooks/api/user/useGetNotifications";

type NotificationContextType = {
  messageNotification: number;
  notificationsState: NotificationType[];
  setNotificationsState: React.Dispatch<
    React.SetStateAction<NotificationType[]>
  >;
  setMessageNotification: React.Dispatch<React.SetStateAction<number>>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messageNotification, setMessageNotification] = useState<number>(0);
  const [notificationsState, setNotificationsState] = useState<
    NotificationType[]
  >([]);
  const { notifications } = useGetNotifications();

  useEffect(() => {
    if (notifications && user?.isAuthenticated) {
      setNotificationsState(notifications);
      const messageNotifications =
        notifications.length > 0 &&
        notifications.filter((n: NotificationType) => n.type === "message");
      setMessageNotification(messageNotifications?.length || 0);
    }
  }, [notifications, user?.isAuthenticated]);

  useEffect(() => {
    socket?.on("receiveMessage", () => {
      setMessageNotification((prev) => prev + 1);
    });
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{
        messageNotification,
        notificationsState,
        setNotificationsState,
        setMessageNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationContextProvider"
    );
  }
  return context;
};

export { useNotificationContext, NotificationContextProvider };
