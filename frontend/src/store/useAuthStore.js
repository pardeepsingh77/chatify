import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp : false,

    

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data })
        } catch (error) {
            console.log('Something went wrong in auth check', error)
            set({ authUser: null })
        }finally{
            set({isCheckingAuth: false})
        }
    },
    signup: async (data) => {
        try {
           set({isSigningUp : true}) 
           const res = await axiosInstance.post('/auth/signup',data)
           set({authUser: res.data});
           toast.success("Account Created Successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log('Something went wrong while signing in',error)
        }finally{
           set({isSigningUp : false}) 

        }
    }
}))