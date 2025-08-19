import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });

      navigate("/");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form
          className='flex flex-col gap-5 p-10 flex-1'
          onSubmit={handleSubmit}>
          <h3 className='text-lg'>Profile Details</h3>
          <label
            htmlFor='avatar'
            className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type='file'
              id='avatar'
              accept='.png,.jpeg,.jpg'
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${selectedImage ? "rounded-full" : ""}`}
              alt='Profile avatar'
            />
            Upload Profile Picture
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='p-2  rounded-md focus:outline-none focu:ring-2 focus:ring-violet-500 bg-transparent border border-gray-500'
            placeholder='your name'
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
            rows={3}
            placeholder='Bio'
          />
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-purple-600 text-white py-2 rounded-md text-lg cursor-pointer hover:opacity-90'>
            Save
          </button>
        </form>
        <img
          src={authUser.profilePic || assets.logo_icon}
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
          alt=''
        />
      </div>
    </div>
  );
};

export default ProfilePage;
