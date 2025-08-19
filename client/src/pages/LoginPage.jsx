import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up"); // Keep this as "Sign up" or "Login"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normalize state to pass correct endpoint ('signup' or 'login')
    const action = currState.toLowerCase().replace(" ", "");

    login(action, { fullName, email, bio, password });
  };

  const switchToLogin = () => {
    setCurrState("Login");
    setFullName("");
    setEmail("");
    setBio("");
    setPassword("");
  };

  const switchToSignup = () => {
    setCurrState("Sign up");
    setFullName("");
    setEmail("");
    setBio("");
    setPassword("");
  };

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* Logo */}
      <img
        src={assets.logo_big}
        className='w-[min(30vw,250px)]'
        alt='App Logo'
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        {/* Title + Switch */}
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
        </h2>

        {/* Full Name & Bio shown only in Signup */}
        {currState === "Sign up" && (
          <>
            <input
              type='text'
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
              placeholder='Full Name'
              required
            />
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Provide a short bio'
              required
            />
          </>
        )}

        {/* Email + Password */}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type='email'
          placeholder='Email Address'
          required
          className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type='password'
          placeholder='Password'
          required
          className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />

        {/* Terms Checkbox for Signup */}
        {currState === "Sign up" && (
          <label className='flex items-center gap-2 text-sm text-gray-400'>
            <input type='checkbox' required />
            <span>Agree to the terms of use & privacy policy</span>
          </label>
        )}

        {/* Submit Button */}
        <button
          type='submit'
          className='bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 rounded-md cursor-pointer hover:opacity-90'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {/* Switch form links */}
        <div className='flex flex-col gap-2 '>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <span
                onClick={switchToLogin}
                className='font-medium text-violet-500 cursor-pointer'>
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account{" "}
              <span
                onClick={switchToSignup}
                className='font-medium text-violet-500 cursor-pointer'>
                click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
