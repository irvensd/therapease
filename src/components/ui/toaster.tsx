import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastWithIcon,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <ToastWithIcon
            key={id}
            variant={variant}
            title={title as string}
            description={description as string}
            {...props}
          >
            {action}
          </ToastWithIcon>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
