import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function NoBodyModal({
  isOpen,
  setIsOpen,
  children,
  onRequestClose,
}: FormModalProps) {
  const handleCloseModal = () => {
    setIsOpen(false);
    onRequestClose?.();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          as={Fragment}
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-10">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              as={Fragment}
            >
              <Dialog.Panel className="relative w-max transform transition-all">
                {/* Close Button */}
                <div className="absolute z-50 top-12 right-16 sm:right-24">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent p-2 text-sm font-medium text-black"
                    onClick={handleCloseModal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={4}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
