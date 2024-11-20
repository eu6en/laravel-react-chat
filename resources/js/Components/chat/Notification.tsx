import { useNotificationHandler } from "@/hooks/useNotificationListener";
import { NotificationResource } from "@/Types/Controllers/ChatController";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {

    const showNotificationToast = (notification: NotificationResource) => {
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
