import cloudinary from '../../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../../lib/socket.js';
import Message from '../modals/message.modal.js'
import User from '../modals/user.modal.js'

export const getAllContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const userId = req.user._id;
        const otherUserId = req.params.id;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(messages)
    }
    catch (err) {
        console.log("Error in getMessagesByUserId controller", err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        if(!text && !image){
            return res.status(400).json({message : "Message text or image is required"})
        }
        if(senderId.equals(receiverId)){
            return res.status(400).json({message : "You cannot send message to yourself"})
        }
        const receiverExists = await User.findById(receiverId);
        if(!receiverExists){
            return res.status(404).json({message : "Receiver not found"})
        }
        let imageUrl; 
        if(image){
            const data = await cloudinary.uploader.upload(image);
            imageUrl = data.secure_url
        }
        const message = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await message.save();

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", message)
        }
        res.status(201).json({newMessage:message})
    } catch (error) {
        console.log("Error in sendMessage controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllChats = async (req , res) => {
    try {
        const loggedInUser = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId : loggedInUser},
                {receiverId : loggedInUser}
            ]
        })
        const chatPartnerIds =[ ...new Set(
            messages.map((msg)=>msg.senderId.toString() === loggedInUser.toString() ? msg.receiverId.toString() : msg.senderId.toString())
        )]
        const chatPartners = await User.find({_id : {$in : chatPartnerIds}}).select("-password");
        res.status(200).json(chatPartners)
    } catch (error) {
        console.log("Error in getAllChats controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}