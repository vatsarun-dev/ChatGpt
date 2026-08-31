import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logIn } from "../../state/authReducers.jsx";

import logo from "../../../../assets/logo.svg";
import { registerApi } from "../../service/authService.js";

import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
} from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const password = watch("password");
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const { name, email, password } = data;
      const user = await registerApi({ name, email, password });
      console.log(user);
      dispatch(logIn(user.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-3xl" />

        <div className="absolute bottom-[-180px] left-[-150px] h-[400px] w-[400px] rounded-full bg-zinc-600/[0.05] blur-3xl" />

        <div className="absolute right-[-150px] top-1/3 h-[400px] w-[400px] rounded-full bg-zinc-500/[0.04] blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080808_75%)]" />
      </div>

      {/* Registration */}
      <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[450px]">
          {/* Card */}
          <div className="rounded-3xl border border-white/[0.09] bg-[#111111]/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
            {/* Logo */}
            <div className="mb-5 flex justify-center">
              <img src={logo} alt="ChatGPT Logo" className="h-14 w-14" />
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Start building with your AI workspace
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Full name
                </label>

                <div
                  className={`group flex items-center rounded-xl border bg-black/30 transition ${
                    errors.name
                      ? "border-red-500/50"
                      : "border-white/10 focus-within:border-white/25"
                  }`}
                >
                  <User className="ml-3 h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-zinc-400" />

                  <input
                    id="name"
                    type="text"
                    placeholder="Arun Vats"
                    autoComplete="name"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must contain at least 2 characters",
                      },
                    })}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Email address
                </label>

                <div
                  className={`group flex items-center rounded-xl border bg-black/30 transition ${
                    errors.email
                      ? "border-red-500/50"
                      : "border-white/10 focus-within:border-white/25"
                  }`}
                >
                  <Mail className="ml-3 h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-zinc-400" />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Password
                </label>

                <div
                  className={`group flex items-center rounded-xl border bg-black/30 transition ${
                    errors.password
                      ? "border-red-500/50"
                      : "border-white/10 focus-within:border-white/25"
                  }`}
                >
                  <LockKeyhole className="ml-3 h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-zinc-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must contain at least 8 characters",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-3 text-zinc-600 transition hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Confirm password
                </label>

                <div
                  className={`group flex items-center rounded-xl border bg-black/30 transition ${
                    errors.confirmPassword
                      ? "border-red-500/50"
                      : "border-white/10 focus-within:border-white/25"
                  }`}
                >
                  <LockKeyhole className="ml-3 h-4 w-4 shrink-0 text-zinc-600 transition group-focus-within:text-zinc-400" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="mr-3 text-zinc-600 transition hover:text-zinc-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/15 bg-black/30 checked:bg-white"
                    {...register("terms", {
                      required: "You must accept the terms",
                    })}
                  />

                  <Check className="pointer-events-none absolute left-0.5 top-0.5 hidden h-3 w-3 text-black peer-checked:block" />
                </div>

                <label
                  htmlFor="terms"
                  className="cursor-pointer text-xs leading-5 text-zinc-500"
                >
                  I agree to the{" "}
                  <span className="text-zinc-300 hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-zinc-300 hover:underline">
                    Privacy Policy
                  </span>
                </label>
              </div>

              {errors.terms && (
                <p className="-mt-2 text-xs text-red-400">
                  {errors.terms.message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Creating account..." : "Create account"}

                {!isSubmitting && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.08]" />

              <span className="text-xs text-zinc-600">OR</span>

              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            {/* Social Signup */}
            <div className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
                Continue with GitHub
              </button>
            </div>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                type="button"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-center gap-5 text-xs text-zinc-700">
            <button className="transition hover:text-zinc-400">Privacy</button>

            <span>•</span>

            <button className="transition hover:text-zinc-400">Terms</button>

            <span>•</span>

            <button className="transition hover:text-zinc-400">Help</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
