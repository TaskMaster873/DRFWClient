import { Store, NOTIFICATION_TYPE } from 'react-notifications-component';

export enum NotificationType {
    SUCCESS = "success",
    WARNING = "warning",
    INFO = "info",
    ERROR = "danger"
}

class InternalNotificationManager {
    private showNotification(title: string, message: string, type: NOTIFICATION_TYPE | undefined) : void {
        Store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        });
    }

    public success(title: string, message: string) : void {
        this.showNotification(title, message, NotificationType.SUCCESS);
    }

    public warn(title: string, message: string) : void {
        this.showNotification(title, message, NotificationType.WARNING);
    }

    public error(title: string, message: string) : void {
        this.showNotification(title, message, NotificationType.ERROR);
    }

    public info(title: string, message: string) : void {
        this.showNotification(title, message, NotificationType.INFO);
    }
}

export const NotificationManager = new InternalNotificationManager;
