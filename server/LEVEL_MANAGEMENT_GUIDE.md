# Dynamic Level Management Guide

## Overview
The LMS system is designed to dynamically handle level updates without requiring code changes. Here's how to manage levels as your data grows.

## How Levels Are Fetched

### Current System
Levels are fetched dynamically from the database based on available questions:
- **Endpoint**: `/api/test/levels?type=aptitude|dsa|dev`
- **Logic**: The system queries all unique level numbers from questions
- **No hardcoded limit**: System automatically adapts to new levels

### File: `server/controllers/testController.js`

The `getLevels` function:
```javascript
const available = rawLevels
  .map(n => Number(n))
  .filter(n => !Number.isNaN(n))
  .sort((a, b) => a - b);
```

This automatically:
1. Extracts all level numbers from questions
2. Sorts them in ascending order
3. Handles any number of levels (1, 50, 100+)

## Adding New Levels

### Step 1: Add Questions to Database
Add questions with higher level numbers to the `Question` model:

```javascript
// Example: Adding Level 11-15 questions
const newQuestions = [
  {
    type: "aptitude",      // aptitude, dsa, or dev
    level: 11,             // New level
    question: "Your question here",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    difficulty: "Intermediate"  // Beginner, Intermediate, Advanced, Expert
  },
  // Add more questions for level 11, 12, 13, 14, 15
];

await Question.insertMany(newQuestions);
```

### Step 2: System Automatically Detects
No code changes needed! The next time users visit the practice section:
1. Frontend calls `/api/test/levels?type=aptitude`
2. Backend queries all unique levels from Question collection
3. New levels automatically appear in the level selector

## Updating Existing Levels

### Adding More Questions to Existing Level
```javascript
await Question.insertMany([
  {
    type: "aptitude",
    level: 5,  // Existing level
    question: "New question for level 5",
    options: ["A", "B", "C", "D"],
    correctAnswer: 1,
    difficulty: "Beginner"
  }
]);
```

### The system handles this because:
- Questions per level is fetched from `/api/test/level-questions`
- Uses `limit` for pagination if needed
- No hardcoded question count

## Seed Questions Script

### Location: `server/scripts/seedQuestions.js`

Use this to bulk insert questions:

```bash
node server/scripts/seedQuestions.js
```

**How to use:**
1. Update the script with your questions data
2. Run the script to insert all questions at once
3. Levels are automatically available

## Frontend Changes (None Needed!)

The frontend is already dynamic:

### LevelSelector Component `client/src/tests/LevelSelector.jsx`
- ✅ Automatically displays all fetched levels
- ✅ No hardcoded level count
- ✅ Responsive to new levels added to DB

### Dynamic Grid
```javascript
{levels.map((level) => {
  // Renders ALL fetched levels
  // No limit hardcoded
})}
```

## Database Schema Update (If Needed)

### Current Question Schema
```javascript
{
  type: String,          // "aptitude", "dsa", "dev"
  level: Number,         // Any positive number (1, 2, 50, 100...)
  difficulty: String,    // "Beginner", "Intermediate", "Advanced", "Expert"
  question: String,
  options: [String],
  correctAnswer: Number
}
```

### To Support More Metadata (Optional)
```javascript
{
  // Add these fields if needed
  topic: String,         // "Algebra", "Graphs", "Trees", etc.
  category: String,      // "Math", "Verbal", "Logic"
  difficulty_score: Number  // 1-10 for finer control
}
```

## API Endpoints for Level Management

### Get All Levels
```
GET /api/test/levels?type=aptitude|dsa|dev
```
**Response**:
```json
{
  "success": true,
  "levels": [1, 2, 3, 4, 5, ...]  // Auto-detected from DB
}
```

### Get All Questions for a Level
```
GET /api/test/level-questions?type=aptitude&level=5
```
**Response**:
```json
{
  "success": true,
  "questions": [
    {
      "_id": "...",
      "question": "...",
      "options": ["A", "B", "C", "D"]
    }
  ]
}
```

### Get Single Question
```
GET /api/test/question?type=aptitude&level=5&index=0
```

## Performance Optimization (For 100+ Levels)

### Current Approach
- Fetches all level numbers on each request
- Good for < 100 levels

### For Scaling Up
**Add Caching** in `testController.js`:

```javascript
// Add to top of file
const levelCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

export const getLevels = async (req, res) => {
  const { type } = req.query;
  const cacheKey = `levels_${type}`;
  
  // Check cache
  if (levelCache.has(cacheKey)) {
    const cached = levelCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ success: true, levels: cached.data });
    }
  }
  
  // Fetch from DB
  const levels = await Question.distinct('level', { type });
  
  // Cache result
  levelCache.set(cacheKey, {
    data: levels,
    timestamp: Date.now()
  });
  
  res.json({ success: true, levels });
};
```

**Clear Cache When Adding Questions**:
```javascript
// In your question creation endpoint
await Question.create(newQuestions);
levelCache.clear(); // Invalidate cache
```

## Monitoring

### Check How Many Levels Exist
```bash
db.questions.find({ type: "aptitude" }).distinct("level");
db.questions.find({ type: "dsa" }).distinct("level");
db.questions.find({ type: "dev" }).distinct("level");
```

### Count Questions per Level
```bash
db.questions.aggregate([
  { $match: { type: "aptitude" } },
  { $group: { _id: "$level", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);
```

## Testing New Levels

1. **Add test questions** to a specific level
2. **Restart backend** (if using caching)
3. **Visit practice page** - new levels should appear
4. **Click a level** - questions load automatically

## Maintenance Checklist

- [ ] Every 10 levels, test the UI responsiveness
- [ ] Monitor database query performance
- [ ] Keep difficulty distribution balanced
- [ ] Update `/api/test/recommendations` if adding many new levels
- [ ] Archive old test attempts yearly
- [ ] Validate test types match enum values: "aptitude", "dsa", "dev"

