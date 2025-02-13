const Staff = require('../models/staff');
const bcrypt = require('bcryptjs');

// Register a new staff member
const registerStaff = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new Staff({
      name,
      email,
      password: hashedPassword,
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

// Manage staff schedule
const manageSchedule = async (req, res) => {
  const { id } = req.params;
  const { schedule } = req.body;

  try {
    const staff = await Staff.findByIdAndUpdate(
      id,
      { $set: { schedule } },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Schedule updated successfully', staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerStaff,
  loginStaff,
  getStaffProfile,
  updateStaffProfile,
  assignWards,
  manageSchedule,
};
