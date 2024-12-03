import { Notification } from "types";

function Notifications({
  notifications,
  clear,
}: {
  notifications: Notification[];
  clear: () => void;
}) {
  return (
    <div className="container max-w-md mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg">
      {notifications?.length > 0 ? (
        <>
          {notifications.map((notification: Notification, index: number) => (
            <div
              className="notification p-4 mb-3 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
              key={index}
            >
              <p className="text-gray-800">{notification?.message}</p>
            </div>
          ))}
          <div className="text-center mt-4">
            <span
              className="text-sm text-red-600 font-medium cursor-pointer hover:underline"
              onClick={clear}
            >
              Clear all
            </span>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 text-sm">
          No new notifications
        </p>
      )}
    </div>
  );
}

export default Notifications;
