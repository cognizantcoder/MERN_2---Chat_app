import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSideBar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  //get all the image from the message and set them to state

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);
  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}>
        {/* Profile Section */}
        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            className='w-20 aspect-[1/1] rounded-full'
            alt='User Avatar'
          />
          <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
            {onlineUsers.includes(selectedUser._id) && (
              <p className='w-2 h-2 rounded-full bg-green-500'></p>
            )}

            {selectedUser.fullName}
          </h1>
          <p className='p-10 mx-auto'>{selectedUser.bio}</p>
        </div>

        <hr className='border-[#ffffff50] my-4' />

        {/* Media Section */}
        <div className='px-5 text-xs'>
          <p>Media</p>
          <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-2 opacity-80'>
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className='cursor-pointer rounded'>
                <img src={url} className='h-full rounded-md' alt='Media' />
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className='absolute bottom-5 left-1/2 transform -translate-x-1/2 
          bg-gradient-to-r from-purple-400 to-purple-600 px-4 py-2 rounded-full cursor-pointer hover:opacity-90'>
          Logout
        </button>
      </div>
    )
  );
};

export default RightSideBar;
