import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { ArrowLeftIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers = [] } = useAuthStore();
    useEffect(()=>{
        const handleEscKey = (event) => {
            if(event.key === "Escape") setSelectedUser(null);
        } 
        window.addEventListener("keydown",handleEscKey)

        // cleanup function
        return () => window.removeEventListener("keydown",handleEscKey)
    },[setSelectedUser])
    return (
        <div className='flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 min-h-[84px] px-4 md:px-6'>
            <div className='flex items-center space-x-3 min-w-0'>
                <button
                    type='button'
                    onClick={() => setSelectedUser(null)}
                    className='btn btn-ghost btn-circle btn-sm text-slate-300 md:hidden'
                    aria-label='Back to chats'
                >
                    <ArrowLeftIcon className='w-5 h-5' />
                </button>
                <div className={`avatar ${onlineUsers.includes(selectedUser?._id) ? "online" : "offline"}`}>
                    <div className='w-12 rounded-full'>
                        <img src={selectedUser?.profilePic || '/avatar.png'} alt={selectedUser?.fullName} />
                    </div>
                </div>
                <div className='min-w-0'>
                    <h3 className='text-slate-200 font-medium truncate'>{selectedUser.fullName}</h3>
                    <p className='text-slate-400 text-sm'>{onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}</p>
                </div>
            </div>
            <button type='button' onClick={()=>setSelectedUser(null)} className='hidden md:inline-flex'>
                <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-color cursor-pointer'/>
            </button>
        </div>
    )
}

export default ChatHeader
