const Alumni = require('../Models/alumni');
const Event = require('../Models/event');
const Mentorship = require('../Models/Mentorship');
const JobOpening = require('../Models/JobOpening');
const Message = require('../Models/message');
const Conversation = require('../Models/conversation');

const getAllAlumni = async (req, res) => {
  try {
    // Return all fields except sensitive data like password and degreeCertificate
    const alumni = await Alumni.find({ verified: true }).select('-password -degreeCertificate');
    res.status(200).json({ alumni });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ error: 'Failed to retrieve alumni' });
  }
};

const getAlumniProfile = async (req, res) => {
  try {
    const alumniId = req.user?._id || req.params.id;
    
    if (!alumniId) {
      console.error('No alumni ID provided');
      return res.status(400).json({ error: 'Alumni ID is required' });
    }

    console.log('Fetching alumni profile for ID:', alumniId);
    
    const alumni = await Alumni.findById(alumniId);
    
    if (!alumni) {
      console.error('Alumni not found for ID:', alumniId);
      return res.status(404).json({ error: 'Alumni not found' });
    }

    // Calculate profile completeness aligned with Edit Profile UI fields
    // Count: fullName, graduationYear, course, usn (Registration number), fieldOfStudy, profilePhoto
    const profileFields = {
      fullName: !!alumni.fullName,
      graduationYear: !!alumni.graduationYear,
      course: !!alumni.course,
      usn: !!alumni.usn,
      fieldOfStudy: !!alumni.fieldOfStudy,
      profilePhoto: !!alumni.profilePhoto,
    };

    const friendlyNames = {
      fullName: 'Full Name',
      graduationYear: 'Graduation Year',
      course: 'Course',
      usn: 'Registration number',
      fieldOfStudy: 'Branch',
      profilePhoto: 'Profile Photo',
    };

    const completedFields = Object.values(profileFields).filter(Boolean).length;
    const totalFields = Object.keys(profileFields).length;
    const completeness = Math.round((completedFields / totalFields) * 100);
    const missingFields = Object.entries(profileFields)
      .filter(([, filled]) => !filled)
      .map(([key]) => friendlyNames[key] || key);

    res.status(200).json({
      alumni: {
        _id: alumni._id,
        fullName: alumni.fullName,
        graduationYear: alumni.graduationYear,
        collegeEmail: alumni.collegeEmail,
        profilePhoto: alumni.profilePhoto,
        linkedin: alumni.linkedin,
        verified: alumni.verified,
        course: alumni.course,
        usn: alumni.usn,
        fieldOfStudy: alumni.fieldOfStudy,
        createdAt: alumni.createdAt,
        followers: alumni.followers || [],
      },
      profileCompleteness: {
        percentage: completeness,
        fields: profileFields,
        missingFields,
      },
    });
  } catch (error) {
    console.error('Error fetching alumni profile:', error);
    res.status(500).json({ error: 'Failed to retrieve alumni profile' });
  }
};

const getAlumniStats = async (req, res) => {
  try {
    const alumniId = req.user?._id || req.params.id;
    
    console.log('=== getAlumniStats called ===');
    console.log('Alumni ID:', alumniId);
    console.log('req.params:', req.params);
    console.log('req.user:', req.user);
    
    if (!alumniId) {
      return res.status(400).json({ error: 'Alumni ID is required' });
    }
    
    // Count documents created by this specific alumni
    const eventsCount = await Event.countDocuments({ createdBy: alumniId });
    const mentorshipsCount = await Mentorship.countDocuments({ mentorId: alumniId });
    const jobOpeningsCount = await JobOpening.countDocuments({ postedBy: alumniId });
    
    console.log('Counts:', { eventsCount, mentorshipsCount, jobOpeningsCount });
    
    // Get conversations where this alumni is a participant
    const conversations = await Conversation.find({
      participants: alumniId
    }).populate('messages');
    
    // Count unread messages (messages received that haven't been read)
    let unreadMessages = 0;
    
    for (const conversation of conversations) {
      const unreadInConversation = conversation.messages.filter(msg =>
        msg.receiverId.toString() === alumniId.toString() &&
        !msg.deletedFor?.includes(alumniId) &&
        (!msg.readBy || !msg.readBy.includes(alumniId))
      ).length;
      unreadMessages += unreadInConversation;
    }
    
    console.log('Final stats:', {
      totalEvents: eventsCount,
      totalMentorships: mentorshipsCount,
      totalJobOpenings: jobOpeningsCount,
      unreadMessages: unreadMessages,
    });
    
    res.status(200).json({
      stats: {
        totalEvents: eventsCount,
        totalMentorships: mentorshipsCount,
        totalJobOpenings: jobOpeningsCount,
        unreadMessages: unreadMessages,
      },
    });
  } catch (error) {
    console.error('Error fetching alumni stats:', error);
    res.status(500).json({ error: 'Failed to retrieve alumni stats' });
  }
};

const updateAlumniProfile = async (req, res) => {
  try {
    const alumniId = req.user?._id || req.params.id;
    const { fullName, graduationYear, course, usn, fieldOfStudy, profilePhoto, degreeCertificate } = req.body;

    if (!alumniId) {
      console.error('No alumni ID provided for update');
      return res.status(400).json({ error: 'Alumni ID is required' });
    }

    console.log('Updating alumni profile for ID:', alumniId);

    const update = { fullName, graduationYear, course, usn, fieldOfStudy };
    if (typeof profilePhoto === 'string' && profilePhoto.trim()) update.profilePhoto = profilePhoto.trim();
    if (typeof degreeCertificate === 'string' && degreeCertificate.trim()) update.degreeCertificate = degreeCertificate.trim();

    const alumni = await Alumni.findByIdAndUpdate(alumniId, update, { new: true, runValidators: true });

    if (!alumni) {
      console.error('Alumni not found for ID:', alumniId);
      return res.status(404).json({ error: 'Alumni not found' });
    }

    console.log('Alumni profile updated successfully for ID:', alumniId);

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      alumni: {
        _id: alumni._id,
        fullName: alumni.fullName,
        graduationYear: alumni.graduationYear,
        collegeEmail: alumni.collegeEmail,
        profilePhoto: alumni.profilePhoto,
        linkedin: alumni.linkedin,
        course: alumni.course,
        usn: alumni.usn,
        fieldOfStudy: alumni.fieldOfStudy,
        degreeCertificate: alumni.degreeCertificate,
      }
    });
  } catch (error) {
    console.error('Error updating alumni profile:', error);
    res.status(500).json({ error: 'Failed to update alumni profile' });
  }
};

module.exports = { getAllAlumni, getAlumniProfile, getAlumniStats, updateAlumniProfile };
