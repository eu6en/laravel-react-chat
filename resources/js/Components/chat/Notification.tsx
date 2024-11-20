import { useNotification } from "@/Context/NotificationContext";
import { useUser } from "@/Context/UserContext";
import { NotificationResource } from "@/Types/Controllers/ChatController";
import { useEffect } from "react";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
    const { notifications, addNotification, removeNotification } = useNotification();
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            return;
        }

        const channel = window.Echo.private(`notifications.${user.id}`)
            .listen('UserNotification', (event) => {

                const notification: NotificationResource = event.notification;

                // Handle the notification
                addNotification(event.notification.message, 'info');
                toast(
                    <div className="border-l-4 border-l-[#3B82F6] pl-4 ">
                        <div>
                            New message from <b>{notification.sender_name}</b>
                            {notification.isGroup && (
                                <> in <b>{notification.chat_name}</b></>
                            )};
                        </div>
                        <div className="leading-5 text-sm mt-2 line-clamp-1">
                            {notification.content}
                        </div>
                    </div>
                    , {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    }
                ); // Show toast notification with link
            });

        return () => {
            channel.stopListening('UserNotification');
            window.Echo.leave(`notifications.${user.id}`);
        };
    }, [user, addNotification]);

    return (
        <>
            <ToastContainer />
        </>
    );
};

export default Notification;
