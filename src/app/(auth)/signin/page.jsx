"use client";
import React from "react";
import Link from "next/link";
import Form from "next/form";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

const SigninPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleSigninFunc = async (data) => {
    const { email, password } = data;
    console.log("Sign-in Data:", data);
    // Add your sign-in logic here

    const { data: res, error } = await authClient.signIn.email({
      email: email, // user email address
      password: password, // user password -> min 8 characters by default
      name: name, // user display name
      image: photoUrl, // User image URL (optional)
      callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
    });
    console.log("Sign-in Response:", res, error);
    if (error) {
      // Handle sign-in error (e.g., show an error message to the user)
      alert(error.message);

    }
    if (res) {
      // Handle successful sign-in (e.g., show a success message or redirect the user)
      alert("Sign-in successful!");
    }
  };
  return (
    <div className="flex flex-col bg-[#f3f4f6]">
      {/* Main Content */}
      <main className="container mx-auto flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-125 p-8 shadow-sm rounded-sm">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center text-[#3b3b3b] mb-6">
            Sign in to your account
          </h2>

          {/* Divider */}
          <hr className="border-gray-200 mb-6" />

          <Form
            action="/signin-endpoint"
            onSubmit={handleSubmit(handleSigninFunc)}
          >
            {/* Name Input */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-[#3b3b3b] font-bold mb-2 text-base"
              >
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                {...register("name", { required: true })}
                className="w-full bg-[#f3f4f6] p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
                required
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            {/* Photo URL Input */}
            <div className="mb-4">
              <label
                htmlFor="photoUrl"
                className="block text-[#3b3b3b] font-bold mb-2 text-base"
              >
                Photo URL
              </label>
              <input
                type="url"
                name="photoUrl"
                id="photoUrl"
                placeholder="Enter your photo URL"
                {...register("photoUrl")}
                className="w-full bg-[#f3f4f6] p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-[#3b3b3b] font-bold mb-2 text-base"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
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
                name="password"
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

            {/* Terms and Conditions Checkbox */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                className="w-4 h-4 mr-3 rounded border-gray-300 text-[#404040] focus:ring-[#404040]"
                {...register("terms", { required: true })}
              />
              <label
                htmlFor="terms"
                className="text-[#737373] font-medium text-sm cursor-pointer"
              >
                Accept{" "}
                <span className="font-bold text-[#404040]">
                  Term & Conditions
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#404040] text-white font-bold text-base py-3 rounded hover:bg-[#2d2d2d] cursor-pointer transition-colors"
            >
              Sign In
            </button>
          </Form>

          <p className="text-center mt-6 text-[#737373] font-semibold text-sm">
            Already Have An Account ?{" "}
            <Link href="/login" className="text-[#f05252] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SigninPage;
