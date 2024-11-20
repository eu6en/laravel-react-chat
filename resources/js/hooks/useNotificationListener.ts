import { useUser } from "@/Context/UserContext";
import { NotificationResource } from "@/Types/Controllers/ChatController";
import { useEffect } from 'react';

export const useNotificationHandler = (handleNotification: (notification: NotificationResource) => void) => {
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            return;
        }

        const channel = window.Echo.private(`notifications.${user.id}`)
            .listen('UserNotification', (event) => {
                const notification: NotificationResource | null = event.notification;

                // Validate the notification object
                if (notification?.chat_id || notification?.message?.sender_id || notification?.message?.content) {
                    handleNotification(notification);
                } else {
                    throw new Error('Invalid notification received');
                }
            });

        return () => {
            channel.stopListening('UserNotification');
            window.Echo.leave(`notifications.${user.id}`);
        };
    }, [user]);
};
