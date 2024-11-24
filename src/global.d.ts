// global.d.ts
import { NotificationApiInjection } from 'naive-ui/lib/notification/src/NotificationProvider';
import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';
import { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider';

declare global {
  interface Window {
    $notification: NotificationApiInjection;
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    documentPictureInPicture: {
      requestWindow: (options: { width: number; height: number }) => Promise<Window>;
      window: Window;
    };
  }
}
