const Staff = require('../models/staff');
const bcrypt = require('bcryptjs');
const Admission = require('../models/patientAdmission');

// Register a new staff member
const registerStaff = async (req, res) => {
  const { name, email, phoneNumber, address, role } = req.body;

  try {
    const staff = new Staff({
      name,
      email,
      phoneNumber,
      address,
      role,
    });

    await staff.save();
    res.status(201).json({ message: 'Staff registered successfully', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login a staff member
const loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get staff profile


// controllers/staffController.js
const getMyStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findOneAndUpdate(
      { userId: req.userId },
      {
        // These fields will be created/updated every time
        $set: {
          firstName: req.userFirst,
          lastName: req.userLast,
          email: req.userEmail,
          phoneNumber: req.userPhone,
          address: req.userAddress,
          role: req.userRole
        },
        // Only on initial insert
        $setOnInsert: {
          userId: req.userId,
          wardsAssigned: [],   // default once
          schedule: []
        }
      },
      {
        new: true,   // return the updated or newly inserted doc
        upsert: true    // insert if missing
      }
    );

    return res.status(200).json(staff);
  } catch (err) {
    console.error(' Error in getMyStaffProfile:', err);
    return res.status(500).json({ error: err.message });
  }
};



const getStaffProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all register staff
const getAllStaff = async (req, res) => {
  try {
    const doctors = await Staff.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update staff profile
const updateStaffProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const staff = await Staff.findByIdAndUpdate(id, updates, { new: true });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assign wards to staff
const assignWards = async (req, res) => {
  const { id } = req.params;
  const { wards } = req.body;

  try {
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $push: { wardsAssigned: { $each: wards } } },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Wards assigned successfully', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// remove ward 
const removeWard = async (req, res) => {
  const { id } = req.params;
  const { ward } = req.body;

  try {
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $pull: { wardsAssigned: ward } },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Ward removed successfully', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manage staff schedule
const manageSchedule = async (req, res) => {
  const { id } = req.params;
  const { date, shift } = req.body;

  try {
    const scheduleEntry = { date: new Date(date), shift };
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $push: { schedule: scheduleEntry } },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Schedule added successfully', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// removing shift
// controllers/staffController.js
const removeShift = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  try {
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $pull: { schedule: { date: new Date(date) } } },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Shift removed', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//Admit a patient
const admitPatient = async (req, res) => {
  const { name, dob, phone, ward, bed, condition } = req.body;

  try {
    const newAdmission = new Admission({ name, dob, phone, ward, bed, condition });
    await newAdmission.save();
    res.status(201).json({ message: 'Patient admitted successfully', patient: newAdmission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//List all admitted patients
const getAdmittedPatients = async (req, res) => {
  try {
    const patients = await Admission.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update an admitted patient
const updateAdmission = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedPatient = await Admission.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Admitted patient not found' });
    }

    res.status(200).json({ message: 'Admission updated successfully', patient: updatedPatient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an admitted patient
const deleteAdmission = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPatient = await Admission.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Admitted patient not found' });
    }

    res.status(200).json({ message: 'Admission deleted successfully', patient: deletedPatient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detials of admitted patient
const getAdmissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Admission.findById(id);

    if (!patient) {
      return res.status(404).json({ message: 'Admitted patient not found' });
    }

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  registerStaff,
  getMyStaffProfile,
  getStaffProfile,
  getAllStaff,
  updateStaffProfile,
  assignWards,
  removeWard,
  manageSchedule,
  removeShift,
  admitPatient,
  getAdmittedPatients,
  updateAdmission,
  deleteAdmission,
  getAdmissionById

};
