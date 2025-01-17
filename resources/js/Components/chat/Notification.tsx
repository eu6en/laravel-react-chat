import { useNotificationHandler } from "@/hooks/useNotificationListener";
import { RootState } from "@/store";
import { NotificationResource } from "@/Types/Controllers/ChatController";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {

    const showNotificationToast = (notification: NotificationResource) => {
        toast(
            <div className="border-l-4 border-l-[#3B82F6] pl-4">
                <div>
                    New message from <b>{notification.message?.sender_name}</b>
                    {notification.is_group && (
                        <> in <b>{notification.chat_name}</b></>
                    )}
                </div>
                <div className="leading-5 text-sm mt-2 line-clamp-1">
                    {notification?.message?.content}
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
                theme: localStorage.theme === 'dark' ? 'dark' : 'light',
                transition: Bounce,
            }
        );
    };

    // Listen for new notifications and display a toast
    useNotificationHandler(showNotificationToast);

    return (
        <>
            <ToastContainer />
        </>
    );
};

export default Notification;
