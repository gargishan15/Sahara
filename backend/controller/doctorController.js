import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }


    docData.available = !docData.available;
    await docData.save();

    res.json({ success: true, message: "Availability Changed", available: docData.available });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])


    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    return res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctor.id
    const appointments = await appointmentModel.find({ docId })

    return res.json({ success: true, appointments })
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}

const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const docId = req.doctor.id

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId.toString() === docId) {

      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: "Appointment marked as completed" });

    } else {
      return res.json({ success: false, message: "Appointment marked as Failed" });
    }



  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}


const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const docId = req.doctor.id

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId.toString() === docId) {

      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: "Appointment marked as cancelled" });

    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }



  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}

const doctorDashboard = async (req, res) => {
  try {
     const docId = req.doctor.id;

    const appointments = await appointmentModel.find({ docId })

    let earnings = 0

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
    })

    let patients = []

    appointments.map((item) => {
      if (!patients.includes(item.userId.toString())) {
        patients.push(item.userId.toString())
      }
    })


    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}

const doctorProfile = async (req, res) => {
  try {
    const docId = req.doctor.id;

    
    const profileData = await doctorModel.findById(docId).select("-password");

    if (!profileData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(
      docId,
      { fees, address, available },
      { new: true }   
    );

    return res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};



export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile};
