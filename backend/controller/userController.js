import appointmentModel from "../models/appointmentModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
import doctorModel from '../models/doctorModel.js';
import razorpay from 'razorpay'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error("Register User Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Login User Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userData = await userModel.findById(userId).select("-password");

        res.status(200).json({ success: true, userData });
    } catch (error) {
        console.log("Get Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const UpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, address, gender, dob } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !address || !gender) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch {
                parsedAddress = address;
            }
        }

        let updateData = { name, phone, address: parsedAddress, dob, gender };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;


            if (fs.existsSync(imageFile.path)) {
                fs.unlinkSync(imageFile.path);
            }
        }

        await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        res.status(200).json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const bookAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select("-password");
        if (!docData || docData.available === false) {
            return res.status(404).json({ success: false, message: "Doctor not available" });
        }


        const existing = await appointmentModel.findOne({ docId, slotDate, slotTime });
        if (existing) {
            return res.status(400).json({ success: false, message: "Slot already booked" });
        }

        const userData = await userModel.findById(userId).select("-password");

        const appointmentData = {
            userId,
            docId,
            slotDate,
            slotTime,
            userData,
            docData,
            amount: docData.fees
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // also push in doctor slots
        await doctorModel.findByIdAndUpdate(docId, {
            $addToSet: { [`slots_booked.${slotDate}`]: slotTime }
        });

        res.status(201).json({ success: true, message: "Appointment booked successfully", appointment: newAppointment });

    } catch (error) {
        if (error.code === 11000) {

            return res.status(400).json({ success: false, message: "Slot already booked" });
        }
        console.error("Book Appointment Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const listAppointment = async (req, res) => {
    try {

        const userId = req.user.id
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id; // auth middleware se
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) return res.status(404).json({ success: false, message: 'Appointment not found' });

        if (appointmentData.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized Action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;

        await doctorModel.findByIdAndUpdate(docId, {
            $pull: { [`slot_booked.${slotDate}`]: slotTime }
        });


        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})




const paymentRazorpay = async (req, res) => {

    try {

        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment cancelled or Not found" })
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,

        }

        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

  const verifyRazorpay = async(req, res) =>{
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        console.log(orderInfo)
        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment: true})
            res.json({success: true, message: 'Payment Successfull'})
        } else{
            res.json({success: false, message: 'Payment failed'})
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
  }


export { registerUser, loginUser, getProfile, UpdateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay };
