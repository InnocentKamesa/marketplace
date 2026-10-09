"use client";

import {Mail, Lock} from "lucide-react";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {ButtonSpinner} from "../../components/spinner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LoginPahge() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);
    console.log("submitting,", formData);
    

    //validation logic here

    // You can add your login logic here, such as making an API call to authenticate the user.
    try{
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      });
      if(!response.ok){
        setLoading(false);
          throw new Error("Failed to Login");
      
      }
      const data = await response.json();
      console.log("Login successful:", data);
      setTimeout( () => {
        setLoading(false);
        router.push("/")}, 3000)
    }
  
  catch(error) {
    console.error("Error:", error)
  }
}
;

  return (
    <div className="flex flex-col gap-4 w-sm px-4">

      <div className="flex flex-col gap-2 px-2 my-4 ">
        <p className="font-bold text-3xl">Login to Account</p>
        <p className="text-sm text-black/60">Kindly fill in the details to login</p>
      </div>
          
            {/**login form */}
            <form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-2 px-2">
            
              {/**email */}
              <label className="input my-2 w-full">
                <Mail className="w-4 h-4"/>
                <input type="text" name="email" onChange={handleChange} className="bg-gray-200 p-2" placeholder="Email Id" />
              </label>

              {/**password */}
              <label className="input my-2 w-full">
                <Lock className="w-4 h-4"/>
                <input type="password" name="password" onChange={handleChange} className="grow bg-gray-200 p-2" placeholder="Password" />
              </label>

              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-primary bg-green-400 text-zinc-600 rounded-md border-0 my-2 w-full" type="submit">{loading ? <ButtonSpinner /> : "Login"}</button>
            </form>
      
    
      {/**Sign up prompt */}
      <div className="flex flex-row gap-2 items-center my-4">
        <p className="text-md">Dont have an account? </p>
        <Link href="/auth/register/"  className="text-green-900 text-md">Register</Link>
      </div>
    </div>
  )
}