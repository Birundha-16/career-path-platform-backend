import Resume from '../models/Resume.js';

// @desc    Get current user's resume
// @route   GET /api/resume
// @access  Private
export const getUserResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ userId: req.user._id });

    if (!resume) {
      resume = await Resume.create({
        userId: req.user._id,
        personalDetails: {
          name: req.user.name,
          email: req.user.email,
        },
        education: {
          college: 'National Engineering College',
          degree: `B.E. ${req.user.department || 'Computer Science'}`,
          gradYear: '2027',
        },
        trackId: req.user.careerPath || 'web-dev',
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save / Update user's resume
// @route   PUT /api/resume
// @access  Private
export const updateUserResume = async (req, res, next) => {
  try {
    const {
      personalDetails,
      education,
      summary,
      trackId,
      skills,
      projects,
      certifications,
      experience,
      achievements,
      // Support flat fields if sent directly from frontend form
      name,
      email,
      phone,
      location,
      linkedin,
      github,
      college,
      degree,
      gradYear,
    } = req.body;

    let resume = await Resume.findOne({ userId: req.user._id });

    if (!resume) {
      resume = new Resume({ userId: req.user._id });
    }

    // Merge personal details
    if (personalDetails) {
      resume.personalDetails = { ...resume.personalDetails, ...personalDetails };
    } else {
      if (name !== undefined) resume.personalDetails.name = name;
      if (email !== undefined) resume.personalDetails.email = email;
      if (phone !== undefined) resume.personalDetails.phone = phone;
      if (location !== undefined) resume.personalDetails.location = location;
      if (linkedin !== undefined) resume.personalDetails.linkedin = linkedin;
      if (github !== undefined) resume.personalDetails.github = github;
    }

    // Merge education
    if (education) {
      resume.education = { ...resume.education, ...education };
    } else {
      if (college !== undefined) resume.education.college = college;
      if (degree !== undefined) resume.education.degree = degree;
      if (gradYear !== undefined) resume.education.gradYear = gradYear;
    }

    if (summary !== undefined) resume.summary = summary;
    if (trackId !== undefined) resume.trackId = trackId;
    if (skills !== undefined) resume.skills = skills;
    if (projects !== undefined) resume.projects = projects;
    if (certifications !== undefined) resume.certifications = certifications;
    if (experience !== undefined) resume.experience = experience;
    if (achievements !== undefined) resume.achievements = achievements;

    const savedResume = await resume.save();

    res.json({
      success: true,
      message: 'Resume saved to database successfully',
      data: savedResume,
    });
  } catch (error) {
    next(error);
  }
};
