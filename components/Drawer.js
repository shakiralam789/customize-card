// components/Drawer.js
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function Drawer({
  children,
  title = "drawer",
  trigger,
  setIsOpen,
  isOpen,
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="cursor-zoom-out fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="text-gray-800 fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 p-4 transition-transform animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
