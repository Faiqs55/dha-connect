const ContactQuery = require("../models/contactQueryModel");

const ensureAdmin = (user) => {
  if (!user) {
    return { status: 401, message: "Authentication required" };
  }
  if (user.role !== "admin") {
    return { status: 403, message: "Only admin can perform this action" };
  }
  return null;
};

const createContactQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required",
      });
    }

    const query = await ContactQuery.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Your message has been received",
      data: query,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getContactQueries = async (req, res) => {
  try {
    const authError = ensureAdmin(req.user);
    if (authError) {
      return res.status(authError.status).json({
        success: false,
        message: authError.message,
      });
    }

    const queries = await ContactQuery.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      message: "Contact queries fetched successfully",
      data: queries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createContactQuery,
  getContactQueries,
};


