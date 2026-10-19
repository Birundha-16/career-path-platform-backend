import User from '../models/User.js';
import Progress from '../models/Progress.js';
import CareerPath from '../models/CareerPath.js';
import CodingProblem from '../models/CodingProblem.js';
import PracticeQuestion from '../models/PracticeQuestion.js';

// @desc    Get complete dashboard overview data for logged-in user
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let progress = await Progress.findOne({ userId: user._id });
    if (!progress) {
      progress = await Progress.create({ userId: user._id });
    }

    // Get total counts from DB for dynamic percentage and calculations
    const totalCareerPaths = await CareerPath.countDocuments();
    const allTracks = await CareerPath.find({});
    const totalCodingProblems = await CodingProblem.countDocuments();
    const totalQuizQuestions = await PracticeQuestion.countDocuments();

    // Calculate total skills count across tracks
    let totalSkillsCount = 0;
    const perTrackStats = [];

    const checkedMap = progress.checkedSkills ? Object.fromEntries(progress.checkedSkills) : {};

    allTracks.forEach((track) => {
      const skills = track.stations.flatMap((s) => s.skills);
      totalSkillsCount += skills.length;

      // Count skills completed for this track
      const trackCompletedSkills = skills.filter((sk) => {
        const basic = Boolean(checkedMap[`${track.id}::${sk}::basic`]);
        const advanced = Boolean(checkedMap[`${track.id}::${sk}::advanced`]);
        const p1 = Boolean(checkedMap[`${track.id}::${sk}::practice::example`]);
        const p2 = Boolean(checkedMap[`${track.id}::${sk}::practice::explain`]);
        const p3 = Boolean(checkedMap[`${track.id}::${sk}::practice::exercises`]);
        const aDate = Boolean(checkedMap[`${track.id}::${sk}::assessment_date`]);
        const c1 = Boolean(checkedMap[`${track.id}::${sk}::assessment_check::explain_others`]);
        const c2 = Boolean(checkedMap[`${track.id}::${sk}::assessment_check::built_something`]);
        const c3 = Boolean(checkedMap[`${track.id}::${sk}::assessment_check::confident`]);
        const taken = Boolean(checkedMap[`${track.id}::${sk}::assessment_taken`]);
        return basic && advanced && p1 && p2 && p3 && aDate && c1 && c2 && c3 && taken;
      });

      const stationStats = track.stations.map((station) => {
        const sDone = station.skills.filter((sk) => {
          const taken = Boolean(checkedMap[`${track.id}::${sk}::assessment_taken`]);
          return taken;
        }).length;
        return {
          title: station.title,
          done: sDone,
          total: station.skills.length,
        };
      });

      const percent = skills.length ? Math.round((trackCompletedSkills.length / skills.length) * 100) : 0;

      perTrackStats.push({
        id: track.id,
        name: track.name,
        color: track.color,
        done: trackCompletedSkills.length,
        total: skills.length,
        percent,
        stations: stationStats,
      });
    });

    // Sort tracks by completion percentage
    perTrackStats.sort((a, b) => b.percent - a.percent);

    // Compute solved counts
    const codingSolvedCount = progress.practiceSolved ? progress.practiceSolved.length : 0;
    const quizSolvedCount = progress.quizProgress ? progress.quizProgress.size : 0;
    const interviewCount = progress.interviewCompleted ? progress.interviewCompleted.length : 0;

    const completedSkillsCount = progress.completedSkills ? progress.completedSkills.length : 0;

    // Selected career path details
    const selectedTrack = allTracks.find((t) => t.id === user.careerPath || t.name === user.careerPath) || allTracks[0];

    // Compute overall percentage
    const overallProgress = totalSkillsCount
      ? Math.round((completedSkillsCount / totalSkillsCount) * 100)
      : progress.overallProgress || 0;

    res.json({
      success: true,
      data: {
        // User profile info
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        selectedCareerPath: user.careerPath,
        selectedTrackDetails: selectedTrack
          ? { id: selectedTrack.id, name: selectedTrack.name, color: selectedTrack.color }
          : null,

        // Completed skills info
        completedSkills: completedSkillsCount,
        totalSkills: totalSkillsCount,
        completedSkillsList: progress.completedSkills || [],

        // Overall progress percentage
        progressPercentage: overallProgress,

        // Roadmap progress per track and station
        roadmapProgress: {
          overallPercent: overallProgress,
          perTrack: perTrackStats,
          leader: perTrackStats.find((t) => t.done > 0) || null,
        },

        // Practice progress
        practiceProgress: {
          codingSolved: codingSolvedCount,
          totalCoding: totalCodingProblems,
          quizSolved: quizSolvedCount,
          totalQuiz: totalQuizQuestions,
          interviewPracticed: interviewCount,
        },

        // Skill profile
        skillProfile: progress.skillProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};
