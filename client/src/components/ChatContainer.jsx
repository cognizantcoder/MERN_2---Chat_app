import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../library/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const containerRef = useRef();
  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  const isUserNearBottom = () => {
    if (!containerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Function to send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessages({ text: input.trim() });
    setInput("");
  };

  // Function to send image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      e.target.value = ""; // Clear input after invalid selection
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessages({ image: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // Clear input to allow same file re-selection
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (scrollEnd.current && messages && isUserNearBottom()) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
        <img src={assets.logo_icon} className='max-w-16' alt='Logo' />
        <p className='text-lg font-medium text-white '>
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  return (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className='w-8 rounded-full'
          alt='User Avatar'
        />
        <p className='flex-1 text-lg text-white flex items-center gap-2 '>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span
              className='w-2 h-2 rounded-full bg-green-500'
              aria-label='Online'></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className='md:hidden max-w-7 cursor-pointer'
          alt='Back'
        />
        <img
          src={assets.help_icon}
          className='max-md:hidden max-w-5'
          alt='Help'
        />
      </div>

      {/* chat area */}
      <div
        ref={containerRef}
        className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id ? "flex-row-reverse" : ""
            }`}>
            {msg.image ? (
              <img
                src={msg.image}
                alt='Sent media'
                className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}>
                {msg.text}
              </p>
            )}

            <div className='text-center text-xs'>
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt='User avatar'
                className='w-7 rounded-full'
              />
              <p className='text-gray-500'>
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
            type='text'
            placeholder='Send a message'
            aria-label='Message input'
          />
          <input
            type='file'
            onChange={handleSendImage}
            id='image'
            accept='image/png, image/jpeg'
            hidden
          />
          <label htmlFor='image'>
            <img
              src={assets.gallery_icon}
              alt='Upload image'
              className='w-5 mr-2 cursor-pointer'
            />
          </label>
          <div>
            <img
              src={assets.send_button}
              onClick={handleSendMessage}
              className='w-7 cursor-pointer'
              alt='Send message'
              role='button'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
