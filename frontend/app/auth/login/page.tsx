"use client";

import {Mail, Lock} from "lucide-react";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";

const API_URL = "http://localhost:5000/api";

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
      const response = await fetch(`${API_URL}/auth/login/`, {
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
      setTimeout( () => {
        router.push("/dashboard")}, 3000)
    }
  
  catch(error) {
    console.error("Error:", error)
  }
}
;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold text-3xl my-4">Login to Shopify</p>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button className="btn btn-primary w-full rounded-sm bg-blue-600 border-0 text-white" onClick={() => document.getElementById('my_modal_5').showModal()}>Login with Email</button>

      {/**modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-100">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="text-sm text-black/60">Kindly fill in the details to login</p>
          <div className="modal-action">
            {/**login form */}
            <form method="POST" onSubmit={handleSubmit}>
              <button className="btn btn-lg btn-circle btn-ghost text-black absolute  right-2 top-2">✕</button>

              {/**email */}
              <label className="input my-2">
                <Mail className="w-4 h-4"/>
                <input type="text" name="email" onChange={handleChange} className="bg-gray-200 p-2" placeholder="Email Id" />
              </label>

              {/**password */}
              <label className="input my-2">
                <Lock className="w-4 h-4"/>
                <input type="password" name="password" onChange={handleChange} className="grow bg-gray-200 p-2" placeholder="Password" />
              </label>

              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-primary bg-blue-600 text-white rounded-md border-0 my-2" type="submit">Login</button>
            </form>
          </div>
        </div>
      </dialog>

      {/**Sign up prompt */}
      <div className="flex flex-row gap-2 items-center absolute bottom-4">
        <p className="text-md">Dont have an account? </p>
        <Link href="/auth/register/"  className="text-blue-600 text-md underline">Register</Link>
      </div>
    </div>
  )
}