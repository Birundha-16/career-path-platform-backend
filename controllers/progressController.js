import Progress from '../models/Progress.js';

// Helper to determine if a skill is fully complete based on 4 stages
// Basic (1), Advanced (1), Practice (3 tasks), Assessment (date + 3 checks + taken)
const checkSkillCompletion = (trackId, skill, checkedMap) => {
  const basic = Boolean(checkedMap[`${trackId}::${skill}::basic`]);
  const advanced = Boolean(checkedMap[`${trackId}::${skill}::advanced`]);
  const p1 = Boolean(checkedMap[`${trackId}::${skill}::practice::example`]);
  const p2 = Boolean(checkedMap[`${trackId}::${skill}::practice::explain`]);
  const p3 = Boolean(checkedMap[`${trackId}::${skill}::practice::exercises`]);
  const aDate = Boolean(checkedMap[`${trackId}::${skill}::assessment_date`]);
  const c1 = Boolean(checkedMap[`${trackId}::${skill}::assessment_check::explain_others`]);
  const c2 = Boolean(checkedMap[`${trackId}::${skill}::assessment_check::built_something`]);
  const c3 = Boolean(checkedMap[`${trackId}::${skill}::assessment_check::confident`]);
  const taken = Boolean(checkedMap[`${trackId}::${skill}::assessment_taken`]);

  return basic && advanced && p1 && p2 && p3 && aDate && c1 && c2 && c3 && taken;
};

// @desc    Get user's progress
// @route   GET /api/progress
// @access  Private
export const getUserProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        checkedSkills: {},
        completedSkills: [],
        completedRoadmapTasks: [],
        solvedProblems: {},
        practiceSolved: [],
        quizProgress: {},
        practicedPrompts: {},
        interviewCompleted: [],
        overallProgress: 0,
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle a skill stage check
// @route   PUT /api/progress/toggle-skill
// @access  Private
export const toggleSkillStage = async (req, res, next) => {
  try {
    const { key, trackId, skill } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'key is required' });
    }

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    const currentVal = progress.checkedSkills.get(key);
    const newVal = !currentVal;
    progress.checkedSkills.set(key, newVal);

    // If trackId & skill provided or parseable from key
    let tid = trackId;
    let skName = skill;
    if (!tid && key.includes('::')) {
      const parts = key.split('::');
      tid = parts[0];
      skName = parts[1];
    }

    if (tid && skName) {
      const plainChecked = Object.fromEntries(progress.checkedSkills);
      const isComplete = checkSkillCompletion(tid, skName, plainChecked);
      const skillKey = `${tid}::${skName}`;

      if (isComplete) {
        if (!progress.completedSkills.includes(skillKey)) {
          progress.completedSkills.push(skillKey);
        }
      } else {
        progress.completedSkills = progress.completedSkills.filter((s) => s !== skillKey);
      }
    }

    progress.recalculateOverallProgress();
    await progress.save();

    res.json({
      success: true,
      key,
      value: newVal,
      completedSkills: progress.completedSkills,
      overallProgress: progress.overallProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set a skill field (e.g. assessment date)
// @route   PUT /api/progress/set-field
// @access  Private
export const setSkillField = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'key is required' });
    }

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    progress.checkedSkills.set(key, value);
    await progress.save();

    res.json({
      success: true,
      key,
      value,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Full batch sync from frontend to MongoDB
// @route   PUT /api/progress/sync
// @access  Private
export const syncProgress = async (req, res, next) => {
  try {
    const { checkedSkills, solvedProblems, quizProgress, practicedPrompts, skillProfile } = req.body;

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    if (checkedSkills && typeof checkedSkills === 'object') {
      Object.entries(checkedSkills).forEach(([k, v]) => {
        progress.checkedSkills.set(k, v);
      });
    }

    if (solvedProblems && typeof solvedProblems === 'object') {
      Object.entries(solvedProblems).forEach(([k, v]) => {
        progress.solvedProblems.set(k, Boolean(v));
        if (v && !progress.practiceSolved.includes(k)) {
          progress.practiceSolved.push(k);
        }
      });
    }

    if (quizProgress && typeof quizProgress === 'object') {
      Object.entries(quizProgress).forEach(([k, v]) => {
        progress.quizProgress.set(k, Boolean(v));
      });
    }

    if (practicedPrompts && typeof practicedPrompts === 'object') {
      Object.entries(practicedPrompts).forEach(([k, v]) => {
        progress.practicedPrompts.set(k, Boolean(v));
        if (v && !progress.interviewCompleted.includes(k)) {
          progress.interviewCompleted.push(k);
        }
      });
    }

    if (skillProfile) {
      progress.skillProfile = { ...progress.skillProfile, ...skillProfile };
    }

    progress.recalculateOverallProgress();
    await progress.save();

    res.json({
      success: true,
      message: 'Progress successfully synced with MongoDB Atlas',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
