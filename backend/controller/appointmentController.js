import Stats from '../models/statsModel.js';
import Property from '../models/propertyModel.js';
import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';
import transporter from "../config/nodemailer.js";
import { getSchedulingEmailTemplate,getEmailTemplate } from '../email.js';

// Format helpers
const formatRecentProperties = (properties) => {
  return properties.map(property => ({
    type: 'property',
    description: `New property listed: ${property.title}`,
    timestamp: property.createdAt
  }));
};

const formatRecentAppointments = (appointments) => {
  return appointments.map(appointment => ({
    type: 'appointment',
    description: `${appointment.userId?.name || appointment.guestInfo?.name || 'Unknown'} scheduled viewing for ${appointment.propertyId.title}`,
    timestamp: appointment.createdAt
  }));
};

// Main stats controller
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalProperties,
      activeListings,
      totalUsers,
      pendingAppointments,
      recentActivity,
      viewsData,
      revenue
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      User.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      getRecentActivity(),
      getViewsData(),
      calculateRevenue()
    ]);

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        totalUsers,
        pendingAppointments,
        recentActivity,
        viewsData,
        revenue
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics'
    });
  }
};

// Activity tracker
const getRecentActivity = async () => {
  try {
    const [recentProperties, recentAppointments] = await Promise.all([
      Property.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt'),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('propertyId', 'title')
        .populate('userId', 'name')
    ]);

    return [
      ...formatRecentProperties(recentProperties),
      ...formatRecentAppointments(recentAppointments)
    ].sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
};

// Views analytics
const getViewsData = async () => {
  try {
    // Fetch last 30 daily summary documents
    const dailyStats = await Stats.find()
      .sort({ date: -1 })
      .limit(30)
      .lean();

    // Map existing data for quick lookup
    const statsMap = new Map(dailyStats.map(s => [s.date, s.viewCount]));

    // Generate dates for the last 30 days to ensure a continuous chart
    const labels = [];
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      
      labels.push(dateString);
      data.push(statsMap.get(dateString) || 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "Property Views",
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error generating chart data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "Property Views",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }
};

// Revenue calculation
const calculateRevenue = async () => {
  try {
    const properties = await Property.find();
    return properties.reduce((total, property) => total + Number(property.price), 0);
  } catch (error) {
    console.error('Error calculating revenue:', error);
    return 0;
  }
};

// Appointment management
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('propertyId', 'title location image')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Normalize: merge userId and guestInfo into a single client shape
    const normalized = appointments.map(apt => ({
      ...apt,
      clientName:  apt.userId?.name  || apt.guestInfo?.name  || 'Unknown',
      clientEmail: apt.userId?.email || apt.guestInfo?.email || '',
      clientPhone: apt.userId?.phone || apt.guestInfo?.phone || '',
      isGuest: !apt.userId,
    }));

    res.json({
      success: true,
      appointments: normalized
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate('propertyId userId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Send email notification
    const recipientEmail = appointment.userId?.email || appointment.guestInfo?.email;
    if (recipientEmail) {
      try {
        const mailOptions = {
          from: process.env.EMAIL,
          to: recipientEmail,
          subject: `Viewing Appointment ${status.charAt(0).toUpperCase() + status.slice(1)} - Haven Homes`,
          html: getEmailTemplate(appointment, status)
        };

        transporter.sendMail(mailOptions).catch(emailErr => {
          console.error('Background status email failed:', emailErr.message);
        });
      } catch (emailErr) {
        console.error('Status email dispatch error:', emailErr.message);
      }
    }

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment'
    });
  }
};

// Schedule viewing — supports only guest bookings
export const scheduleViewing = async (req, res) => {
  try {
    const { propertyId, date, time, notes, name, email, phone, message } = req.body;

    const guestEmail = email;
    const guestName = name;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Build appointment data — store guest info
    const appointmentData = {
      propertyId,
      ...(date && { date }),
      ...(time && { time }),
      notes: notes || message || '',
      status: 'pending',
      guestInfo: { name: guestName, email: guestEmail, phone }
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    await appointment.populate('propertyId');

    // Send confirmation email
    const recipientEmail = guestEmail;
    if (recipientEmail) {
      try {
        const mailOptions = {
          from: process.env.EMAIL,
          to: recipientEmail,
          subject: 'Viewing Request Received - Haven Homes',
          html: getSchedulingEmailTemplate(
            appointment,
            date || 'To be confirmed',
            time || 'To be confirmed',
            notes || message || ''
          )
        };
        transporter.sendMail(mailOptions).catch(emailErr => {
          console.error('Background confirmation email failed:', emailErr.message);
        });
      } catch (emailErr) {
        console.error('Confirmation email dispatch error:', emailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Viewing scheduled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error scheduling viewing:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling viewing'
    });
  }
};

export const updateAppointmentMeetingLink = async (req, res) => {
  try {
    const { appointmentId, meetingLink } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { meetingLink },
      { new: true }
    ).populate('propertyId userId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Send email notification with meeting link
    const recipientEmail = appointment.userId?.email || appointment.guestInfo?.email;
    if (recipientEmail) {
      try {
        const mailOptions = {
          from: process.env.EMAIL,
          to: recipientEmail,
          subject: 'Meeting Link Updated - Haven Homes',
          html: getEmailTemplate(appointment, 'confirmed')
        };

        transporter.sendMail(mailOptions).catch(emailErr => {
            console.error('Background meeting link email failed:', emailErr.message);
        });
      } catch (emailErr) {
        console.error('Meeting link email dispatch error:', emailErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Meeting link updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating meeting link:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating meeting link'
    });
  }
};

export const getAppointmentStats = async (req, res) => {
  try {
    const [pending, confirmed, cancelled, completed] = await Promise.all([
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'cancelled' }),
      Appointment.countDocuments({ status: 'completed' })
    ]);

    // Get stats by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        total: pending + confirmed + cancelled + completed,
        pending,
        confirmed,
        cancelled,
        completed,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment statistics'
    });
  }
};