import { Logger } from "../Logger";

// TODO - implement this
class ServiceNotificationInstance extends Logger {
    public moduleName: string = 'ServiceNotification';
    public logColor: string = '#db70d2';

    constructor() {
        super();
    }

    public notifyInformation(message: string) : void {
        // status bar?
    }

    public notifyClientError(error: string) : void {
        // status bar error msg?
    }
}

const ServiceNotification = new ServiceNotificationInstance();
export default ServiceNotification;
