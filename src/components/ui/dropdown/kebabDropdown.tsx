"use effect";

import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function KebabDropdown({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "text-white" : "text-white/90"}
                group inline-flex items-center rounded-md bg-white px-3 py-2 text-base font-medium hover:bg-gray-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
            >
              <KebabDot />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute top-12 right-0 z-10">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative flex flex-col gap-2 bg-white p-3">
                    {children}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

const KebabDot = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 stroke-black"
    >
      <g clip-path="url(#clip0_105_1881)">
        <rect
          height="0.01"
          strokeLinejoin="round"
          strokeWidth="3"
          transform="rotate(90 12.01 12)"
          width="0.01"
          x="12.01"
          y="12"
        />

        <rect
          height="0.01"
          strokeLinejoin="round"
          strokeWidth="3"
          transform="rotate(90 19.01 12)"
          width="0.01"
          x="19.01"
          y="12"
        />

        <rect
          height="0.01"
          strokeLinejoin="round"
          strokeWidth="3"
          transform="rotate(90 5.01001 12)"
          width="0.01"
          x="5.01001"
          y="12"
        />
      </g>

      <defs>
        <clipPath id="clip0_105_1881">
          <rect
            fill="white"
            height="24"
            transform="translate(0 0.000976562)"
            width="24"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
