import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js"
import userModel from '../models/userModel.js';


const addDoctor = async (req, res) => {
  try {
    console.log("=== Add Doctor API Hit ===");

    req.body = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k.trim(), typeof v === "string" ? v.trim() : v])
    );

    let { name, email, password, speciality, degree, about, experience, fees, address } = req.body;
    const imageFile = req.file;

    console.log("Req Body:", req.body);
    console.log("Req File:", req.file);

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) return res.json({ success: false, message: "Please enter a valid email" });
    if (password.length < 8) return res.json({ success: false, message: "Password must be at least 8 characters" });

    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

   
    const imageUpload = await cloudinary.uploader.upload(imageFile.path.replaceAll('\\','/'), { resource_type: "image" });
    const imageUrl = imageUpload.secure_url;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new doctorModel({
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      fees,
      about,
      address,
      date: Date.now()
    });

    await newDoctor.save();
    res.json({ success: true, message: "Doctor Added" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30d" });
      return res.json({ success: true, message: "Admin logged in successfully", aToken: token });
    }
    res.json({ success: false, message: "Invalid credentials" }); 
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers['atoken'];
    if (!token) return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    console.log("Decoded email:", decoded.email);
    console.log("Expected email:", process.env.ADMIN_EMAIL);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Not Authorized, login again!" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.json({ success: false, message: "Invalid token" });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password');
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentsAdmin = async(req, res) =>{
  try {
    const appointments = await appointmentModel.find({})
    console.log("=== Appointments from DB ===", appointments);
    res.json({success: true,appointments})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    
    const { docId, slotDate, slotTime } = appointmentData;
    if (docId && slotDate && slotTime) {
      await doctorModel.findByIdAndUpdate(docId, {
        $pull: { [`slot_booked.${slotDate}`]: slotTime }
      });
    }

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel Appointment Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const adminDashboard = async(req, res) =>{
  try {
     
   const doctors = await doctorModel.find({})
   const user = await userModel.find({})
   const appointments = await appointmentModel.find({})

   const dashData = {
       doctors: doctors.length,
       appointments: appointments.length,
       patients: user.length,
       latestAppointments: appointments.reverse().slice(0,5) 
   }

   res.json({success:true, dashData})

  } catch (error) {
     console.log(error)
    res.json({ success: false, message: error.message });
  }
}


export { addDoctor, loginAdmin, allDoctors, verifyAdmin, appointmentsAdmin, appointmentCancel, adminDashboard};
