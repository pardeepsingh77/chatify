import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set,get) => ({
    allContacts :   [],
    chats : [],
    messages : [],
    activeTab : 'chats',
    selectedUser :  null,
    isUsersLoading : false,
    isMessagesLoading : false,
    isSoundEnabled : JSON.parse(localStorage.getItem('isSoundEnabled')) === true,

    toggleSound : () => {
        localStorage.setItem("isSoundEnabled",!get().isSoundEnabled)
        set({isSoundEnabled: !get().isSoundEnabled})
    },

    setActiveTab : (tab) => set({activeTab:tab}),
    setSelectedUser : (selectedUser) => set({selectedUser}),

    getAllContacts: async () => {
       set({isUsersLoading : true})
        try {
            const res = await axiosInstance('/messages/contacts')
            set({allContacts : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading : false})
        }
    },
    getMyChatPartners : async () => {
        set({isUsersLoading : true})
        try {
            const res = await axiosInstance('/messages/chats')
            set({chats : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading : false})
        }
    },
    getMessagesByUserId : async (userId) => {
        try {
            set({isMessagesLoading : true})
            const res = await axiosInstance(`/messages/${userId}`)
            set({messages : res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isMessagesLoading : false})
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser } = get();
        const {authUser} = useAuthStore.getState();
        const tempId = `temp-${Date.now()}`
        const optimisticMessage = {
            _id: tempId,
            senderId : authUser._id,
            receiverId : selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        }

        set((state) => ({ messages: [...state.messages, optimisticMessage] }))
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            const newMessage = res.data?.newMessage || res.data;
            set((state) => ({
                messages: state.messages.map((message) =>
                    message._id === tempId ? newMessage : message
                ),
            }))
        } catch (error) {
            set((state) => ({
                messages: state.messages.filter((message) => message._id !== tempId),
            }))
            toast.error(error.response?.data?.message || "something went wrong")
        }

    }
}))