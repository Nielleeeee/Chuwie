import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <section>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <Image
              src={"/logo/chuwie-logo-no-bg.png"}
              alt="chuwie logo"
              width={100}
              height={100}
              className="mx-auto"
            />

            <div className="mt-12 flex flex-col items-center">
              <div className="mt-8">
                <SignIn appearance={{
                  elements: {
                    socialButtonsBlockButton: "bg-purple-100",
                    formButtonPrimary:
                      "bg-purple-400 hover:bg-purple-500 text-sm normal-case",
                    footerActionLink: "text-purple-700"
                  },
                }} />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-purple-100 text-center hidden lg:flex">
            <div className="m-12 xl:m-16 w-full bg-[url('/svg/coffee.svg')] bg-contain bg-center bg-no-repeat"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
