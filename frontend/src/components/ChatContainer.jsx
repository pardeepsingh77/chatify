import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages ,isMessagesLoading , subscribeToMessage , unsubscribeFromMessages} = useChatStore();
  const { authUser } = useAuthStore();
  const messageendRef = useRef(null)

  const formatMessageTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessage()
    }

    return () => unsubscribeFromMessages()
  }, [selectedUser, getMessagesByUserId , subscribeToMessage , unsubscribeFromMessages])

  useLayoutEffect(() => {
    const node = messageendRef.current;
    if (!node) return;

    // wait one frame so the new message is painted before scrolling
    requestAnimationFrame(() => {
      node.scrollIntoView({ block: "end", behavior: "smooth" });
    });
  }, [messages, selectedUser]);


  return (
    <>
      <ChatHeader />
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {messages.length > 0 ? (
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map(msg=>(
              <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                <div className={`chat-bubble relative ${msg.senderId ===  authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className='rounded-lg h-48 object-cover' />
                  )}
                  {msg.text && <p className='mt-2'>{msg.text}</p>}
                  <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageendRef} />
          </div >
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  )
}

export default ChatContainer
