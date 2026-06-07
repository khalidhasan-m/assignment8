"use client";
import Link from "next/link";
import Form from "next/form";
import React from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLoginFunc = async (data) => {
    console.log("Login Data:", data);
    // Add your login logic here
    const { data: res, error } = await authClient.signIn.email({
      /**
       * The user email
       */
      email: data.email,
      /**
       * The user password
       */
      password: data.password,
      /**
       * A URL to redirect to after the user logs in (optional)
       */
      callbackURL: "/",
      /**
       * remember the user session after the browser is closed.
       * @default true
       */
      rememberMe: true,
    });
    console.log("Login Response:", res, error);
    
  };

  return (
    <main
      className="container mx-auto flex items-center justify-center px-4 py-10
    grow bg-[#f3f4f6]"
    >
      <div className="bg-white w-full max-w-125 p-8 shadow-sm rounded-sm">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-[#3b3b3b] mb-6">
          Login your account
        </h2>

        {/* Divider */}
        <hr className="border-gray-200 mb-6" />

        {/* Next.js Form Component */}
        <Form action="/login-endpoint" onSubmit={handleSubmit(handleLoginFunc)}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[#3b3b3b] font-bold mb-2 text-base"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              {...register("email", { required: true })}
              className="w-full bg-[#f3f4f6] p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-[#3b3b3b] font-bold mb-2 text-base"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
              className="w-full bg-[#f3f4f6] p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#404040] text-white font-bold text-base py-3 rounded hover:bg-[#2d2d2d] cursor-pointer transition-colors"
          >
            Login
          </button>
        </Form>

        {/* Footer Links */}
        <p className="text-center mt-6 text-[#737373] font-semibold text-sm">
          Don&apos;t Have An Account ?{" "}
          <Link href="/signin" className="text-[#f05252] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
