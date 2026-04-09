import logo from "../assets/react.svg";
import { FaLock } from "react-icons/fa";
import { MdMail } from "react-icons/md";

export const LoginPage = () => {
  return (
    <div className="container flex justify-center items-center h-screen">
      <div className="container flex justify-center items-center flex-col p-8 w-2/6 bg-blue-100">
      <img src={logo} alt="" />
      <div className=" text-center heading m-4">
        <h1>Welcome back</h1>
        <p className=" text-gray-500">
          Don't have an account yet?{" "}
          <span className="text-black cursor-pointer">Sign up</span>
        </p>
      </div>
      <div className="m-4">
        <div className="flex items-center mb-4 gap-1 bg-white p-2 rounded ">
          <MdMail/>
          <input type="text" placeholder="Email" className=" outline-0"/>
        </div>
        <div className="flex items-center mb-4 gap-1 bg-white p-2">
          <FaLock/>
          <input type="password" placeholder="Password" className="outline-0"/>
        </div>
        <button type="submit" className="text-center bg-black text-white w-full text-md p-2 rounded">Submit</button>
      </div>
      </div>
    </div>
  );
};
