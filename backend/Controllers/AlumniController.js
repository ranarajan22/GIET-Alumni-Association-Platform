const Alumni = require('../Models/alumni');
const Event = require('../Models/event');
const Mentorship = require('../Models/Mentorship');
const JobOpening = require('../Models/JobOpening');
const Message = require('../Models/message');
const Conversation = require('../Models/conversation');

const NETWORK_ALUMNI_FIELDS = [
  '_id',
  'fullName',
  'graduationYear',
  'collegeEmail',
  'registrationNumber',
  'usn',
  'course',
  'branch',
  'fieldOfStudy',
  'profilePhoto',
  'linkedin',
  'github',
  'createdAt'
].join(' ');

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function attachIdentityFields(record) {
  const rollNumber = record?.registrationNumber || record?.usn || '';
  const registrationNumber = record?.usn || record?.registrationNumber || '';

  return {
    ...record,
    rollNumber,
    registrationNumber,
    usn: registrationNumber
  };
}

function buildDirectoryFilter(query = {}) {
  const filter = {};

  if (query.batch) filter.graduationYear = Number(query.batch);
  if (query.course) filter.course = query.course;
  if (query.branch) {
    filter.$or = [{ branch: query.branch }, { fieldOfStudy: query.branch }];
  }
  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      ...(filter.$or || []),
      { fullName: searchRegex },
      { collegeEmail: searchRegex },
      { registrationNumber: searchRegex },
      { usn: searchRegex }
    ];
  }

  return filter;
}

const getAllAlumni = async (req, res) => {
  try {
    const filter = buildDirectoryFilter(req.query);
    // Network directory should expose only required profile fields + social links.
    const alumni = await Alumni.find(filter).select(NETWORK_ALUMNI_FIELDS).lean();
    res.status(200).json({ alumni: alumni.map(attachIdentityFields) });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ error: 'Failed to retrieve alumni' });
  }
};

const getAlumniFacets = async (req, res) => {
  try {
    const [batchValues, courseValues, branchValues, fieldValues] = await Promise.all([
      Alumni.distinct('graduationYear', {}),
      Alumni.distinct('course', {}),
      Alumni.distinct('branch', {}),
      Alumni.distinct('fieldOfStudy', {})
    ]);

    const mergedBranches = Array.from(new Set([...(branchValues || []), ...(fieldValues || [])]));

    res.status(200).json({
      batches: batchValues.filter(Boolean).sort((a, b) => a - b),
      courses: courseValues.filter(Boolean).sort(),
      branches: mergedBranches.filter(Boolean).sort()
    });
  } catch (error) {
    console.error('Error fetching alumni facets:', error);
    res.status(500).json({ error: 'Failed to retrieve alumni facets' });
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
      registrationNumber: !!(alumni.usn || alumni.registrationNumber),
      fieldOfStudy: !!alumni.fieldOfStudy,
      profilePhoto: !!alumni.profilePhoto,
    };

    const friendlyNames = {
      fullName: 'Full Name',
      graduationYear: 'Graduation Year',
      course: 'Course',
      registrationNumber: 'Registration Number',
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
      alumni: attachIdentityFields({
        _id: alumni._id,
        fullName: alumni.fullName,
        graduationYear: alumni.graduationYear,
        collegeEmail: alumni.collegeEmail,
        personalEmail: alumni.personalEmail,
        profilePhoto: alumni.profilePhoto,
        linkedin: alumni.linkedin,
        github: alumni.github,
        course: alumni.course,
        usn: alumni.usn,
        registrationNumber: alumni.registrationNumber,
        fieldOfStudy: alumni.fieldOfStudy,
        branch: alumni.branch,
        mobile: alumni.mobile,
        parentsMobile: alumni.parentsMobile,
        fatherName: alumni.fatherName,
        motherName: alumni.motherName,
        religion: alumni.religion,
        higherStudy: alumni.higherStudy,
        permanentAddress: alumni.permanentAddress,
        dob: alumni.dob,
        dateOfMarriage: alumni.dateOfMarriage,
        currentCompany: alumni.currentCompany,
        designation: alumni.designation,
        currentLocation: alumni.currentLocation,
        dateOfVisit: alumni.dateOfVisit || [],
        createdAt: alumni.createdAt,
        followers: alumni.followers || [],
      }),
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
    const {
      fullName,
      graduationYear,
      course,
      usn,
      registrationNumber,
      rollNumber,
      fieldOfStudy,
      profilePhoto,
      degreeCertificate,
      mobile,
      parentsMobile,
      personalEmail,
      fatherName,
      motherName,
      religion,
      higherStudy,
      permanentAddress,
      dob,
      dateOfMarriage,
      currentCompany,
      designation,
      currentLocation,
      linkedin,
      github
    } = req.body;

    if (!alumniId) {
      console.error('No alumni ID provided for update');
      return res.status(400).json({ error: 'Alumni ID is required' });
    }

    console.log('Updating alumni profile for ID:', alumniId);

    const update = {};

    if (fullName !== undefined) update.fullName = normalizeText(fullName) || 'NA';
    if (graduationYear !== undefined) update.graduationYear = Number(graduationYear) || new Date().getFullYear();
    if (course !== undefined) update.course = normalizeText(course) || 'NA';
    if (fieldOfStudy !== undefined) {
      const normalizedField = normalizeText(fieldOfStudy) || 'NA';
      update.fieldOfStudy = normalizedField;
      update.branch = normalizedField;
    }
    const identityInput = usn !== undefined ? usn : (registrationNumber !== undefined ? registrationNumber : rollNumber);
    if (identityInput !== undefined) {
      const normalizedUsn = normalizeText(identityInput) || 'NA';
      update.usn = normalizedUsn;
      update.registrationNumber = normalizedUsn;
    }

    if (typeof profilePhoto === 'string' && profilePhoto.trim()) update.profilePhoto = profilePhoto.trim();
    if (typeof degreeCertificate === 'string' && degreeCertificate.trim()) update.degreeCertificate = degreeCertificate.trim();
    if (mobile !== undefined) update.mobile = normalizeText(mobile) || 'NA';
    if (parentsMobile !== undefined) update.parentsMobile = normalizeText(parentsMobile) || 'NA';
    if (personalEmail !== undefined) update.personalEmail = normalizeText(personalEmail).toLowerCase() || 'NA';
    if (fatherName !== undefined) update.fatherName = normalizeText(fatherName) || 'NA';
    if (motherName !== undefined) update.motherName = normalizeText(motherName) || 'NA';
    if (religion !== undefined) update.religion = normalizeText(religion) || 'NA';
    if (higherStudy !== undefined) update.higherStudy = normalizeText(higherStudy) || 'NA';
    if (permanentAddress !== undefined) update.permanentAddress = normalizeText(permanentAddress) || 'NA';
    if (currentCompany !== undefined) update.currentCompany = normalizeText(currentCompany) || 'NA';
    if (designation !== undefined) update.designation = normalizeText(designation) || 'NA';
    if (currentLocation !== undefined) update.currentLocation = normalizeText(currentLocation) || 'NA';
    if (linkedin !== undefined) update.linkedin = normalizeText(linkedin) || 'NA';
    if (github !== undefined) update.github = normalizeText(github) || 'NA';

    // Date of visit is admin-managed and intentionally excluded from alumni self-update.
    if (dob !== undefined) {
      const parsedDob = new Date(dob);
      update.dob = Number.isNaN(parsedDob.getTime()) ? null : parsedDob;
    }
    if (dateOfMarriage !== undefined) {
      const parsedMarriage = new Date(dateOfMarriage);
      update.dateOfMarriage = Number.isNaN(parsedMarriage.getTime()) ? null : parsedMarriage;
    }

    const alumni = await Alumni.findByIdAndUpdate(alumniId, update, { new: true, runValidators: true });

    if (!alumni) {
      console.error('Alumni not found for ID:', alumniId);
      return res.status(404).json({ error: 'Alumni not found' });
    }

    console.log('Alumni profile updated successfully for ID:', alumniId);

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      alumni: attachIdentityFields({
        _id: alumni._id,
        fullName: alumni.fullName,
        graduationYear: alumni.graduationYear,
        collegeEmail: alumni.collegeEmail,
        personalEmail: alumni.personalEmail,
        profilePhoto: alumni.profilePhoto,
        linkedin: alumni.linkedin,
        github: alumni.github,
        course: alumni.course,
        usn: alumni.usn,
        registrationNumber: alumni.registrationNumber,
        fieldOfStudy: alumni.fieldOfStudy,
        branch: alumni.branch,
        mobile: alumni.mobile,
        parentsMobile: alumni.parentsMobile,
        fatherName: alumni.fatherName,
        motherName: alumni.motherName,
        religion: alumni.religion,
        higherStudy: alumni.higherStudy,
        permanentAddress: alumni.permanentAddress,
        dob: alumni.dob,
        dateOfMarriage: alumni.dateOfMarriage,
        currentCompany: alumni.currentCompany,
        designation: alumni.designation,
        currentLocation: alumni.currentLocation,
        dateOfVisit: alumni.dateOfVisit || [],
        degreeCertificate: alumni.degreeCertificate,
      })
    });
  } catch (error) {
    console.error('Error updating alumni profile:', error);
    res.status(500).json({ error: 'Failed to update alumni profile' });
  }
};

module.exports = { getAllAlumni, getAlumniFacets, getAlumniProfile, getAlumniStats, updateAlumniProfile };
