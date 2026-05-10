import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp : false,
    isLoggingIn : false,
    isProfileUpdating : false,

    

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data.data })
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
    },
    login: async (data) => {
        try {
           set({isLoggingIn : true}) 
           const res = await axiosInstance.post('/auth/login',data)
           set({authUser: res.data});
           toast.success("Logged in Successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log('Something went wrong while logging in',error)
        }finally{
           set({isLoggingIn : false}) 

        }
    },
    logout: async () => {
        try {
            await axiosInstance.get('/auth/logout');
            set({ authUser: null });
            toast.success("Logged out Successfully!");
        } catch (error) {
            toast.error("Something went wrong while logging out");
            console.log('Something went wrong while logging out', error);
        }
    },
    updateProfile: async (data) => {
        const toastId = toast.loading('Updating profile...')
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser: res.data})
            toast.success('Profile Updated Successfully', { id: toastId })
        } catch (error) {
            console.log("error in update profile:",error)
            toast.error(error.response.data.message, { id: toastId })
        }finally{
            set({isProfileUpdating : false})
        }
    }
}))