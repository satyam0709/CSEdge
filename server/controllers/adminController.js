import Question from "../models/Question.js";

/*
====================================
ADD QUESTION
====================================
*/
export const addQuestion = async (req, res) => {
  try {
    const {
      type,
      level,
      question,
      options,
      correctAnswer,
      explanation,
      topic
    } = req.body;

    // Validation
    if (!type || !level || !question || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (level < 1 || level > 50) {
      return res.status(400).json({
        success: false,
        message: "Level must be between 1 and 50"
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be inside options"
      });
    }

    const newQuestion = await Question.create({
      type,
      level,
      question,
      options,
      correctAnswer,
      explanation,
      topic
    });

    res.json({
      success: true,
      question: newQuestion
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
====================================
GET ALL QUESTIONS (WITH FILTER)
====================================
*/
export const getQuestions = async (req, res) => {
  try {
    const { type, level } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (level) filter.level = Number(level);

    const questions = await Question.find(filter).sort({
      level: 1,
      createdAt: -1
    });

    res.json({
      success: true,
      questions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
====================================
UPDATE QUESTION
====================================
*/
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      level,
      question,
      options,
      correctAnswer,
      explanation,
      topic
    } = req.body;

    if (level < 1 || level > 50) {
      return res.status(400).json({
        success: false,
        message: "Level must be between 1 and 50"
      });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be inside options"
      });
    }

    const updated = await Question.findByIdAndUpdate(
      id,
      {
        type,
        level,
        question,
        options,
        correctAnswer,
        explanation,
        topic
      },
      { new: true }
    );

    res.json({
      success: true,
      question: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
====================================
DELETE QUESTION
====================================
*/
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await Question.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Question deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
