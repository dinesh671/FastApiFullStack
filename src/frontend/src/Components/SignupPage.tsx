import logo from "../assets/react.svg";
import { FaLock, FaUser } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import { data, Link } from "react-router-dom";
import type { SignupType } from "../types/user";
import { useForm } from "react-hook-form";
import { signupSchema } from "../lib/schema";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupType>();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  return (
    <form onSubmit={handleSubmit((Data)=> setFormData(Data))}
    className="container h-screen flex items-center justify-center" >
      <div className="container flex justify-center items-center flex-col p-8 w-2/6 bg-blue-100">
        <img src={logo} alt="" />
        <div className=" text-center heading m-4">
          <h1 className="m-1">Welcome back</h1>
          <p className=" text-gray-500">
            Already an user?{" "}
            <Link to="/login" className="text-black cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
        <div className="m-4">
          <div className="flex items-center mb-4 gap-1 bg-white p-2 rounded ">
            <FaUser />
            <input
              type="text"
              {...register("name")}
              placeholder="Name"
              className=" outline-0 pl-1"
            />
          </div>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <div className="flex items-center mb-4 gap-1 bg-white p-2 rounded ">
            <MdMail />
            <input
              type="email"
              placeholder="Email"
              className=" outline-0 pl-1"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <div className="flex items-center mb-4 gap-1 bg-white p-2">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
              className="outline-0 pl-1"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <div className="flex items-center mb-4 gap-1 bg-white p-2">
            <FaLock />
            <input
              type="password"
              placeholder="Confirm Password"
              className="outline-0 pl-1"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
          <button
            type="submit"
            className="text-center bg-black text-white w-full text-md p-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account" : "Sign up"}
          </button>
        </div>
      </div>
    </form>
  );
}
