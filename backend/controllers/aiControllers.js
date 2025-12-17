// import Groq from "groq-sdk";

// const fallbackPlan = (goal, activity, calorieTarget) => ({
//   calorieTarget,
//   workoutPlan: [
//     "30 min brisk cardio",
//     "20 min strength (squats, pushups, rows)",
//     "10 min core (planks, dead bugs)",
//     "10 min mobility & stretch",
//   ],
//   mealPlan: {
//     breakfast: "Oats + berries + yogurt",
//     lunch: "Grilled chicken + rice + veggies",
//     dinner: "Fish + quinoa + greens",
//     snacks: "Fruit, nuts, Greek yogurt",
//   },
//   weeklyProgress:
//     goal === "lose"
//       ? "Aim for 0.5-1 kg loss per week; adjust calories if plateaus."
//       : goal === "gain"
//       ? "Target 0.25-0.5 kg gain per week; prioritize strength progress."
//       : "Maintain weight; focus on performance and recovery.",
// });

// export const generateAI = async (req, res) => {
//   const { age, weight, height, activity, goal } = req.body;

//   // Require API key from environment; avoid silent hardcoded fallbacks
//   const groqApiKey = process.env.GROQ_API_KEY;

//   // Basic validation to avoid NaN calculations
//   const ageNum = Number(age);
//   const weightNum = Number(weight);
//   const heightNum = Number(height);
//   const activityLevel = activity || "medium";
//   const goalType = goal || "maintain";

//   if (!ageNum || !weightNum || !heightNum) {
//     return res.status(400).json({
//       error: "Invalid input. Please provide valid age, weight, and height.",
//     });
//   }

//   // Basic calorie estimate for context
//   const BMR = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
//   let calorieTarget =
//     activityLevel === "low"
//       ? BMR * 1.2
//       : activityLevel === "medium"
//       ? BMR * 1.55
//       : BMR * 1.75;
//   if (goalType === "lose") calorieTarget -= 500;
//   if (goalType === "gain") calorieTarget += 500;
//   calorieTarget = Math.round(calorieTarget);

//   if (!groqApiKey) {
//     return res.status(500).json({
//       error: "Missing GROQ_API_KEY. Add it to backend/.env and restart the server.",
//     });
//   }

//   const groq = new Groq({ apiKey: groqApiKey });

//   try {
//     // Create a detailed prompt for personalized AI suggestions
//     const userPrompt = `Create a personalized fitness and nutrition plan for:
// - Age: ${age} years
// - Weight: ${weight} kg
// - Height: ${height} cm
// - Activity Level: ${activityLevel}
// - Goal: ${goalType === "lose" ? "Lose weight" : goalType === "gain" ? "Gain weight" : "Maintain weight"}
// - Suggested Daily Calories: ${calorieTarget}

// Provide a tailored workout plan with specific exercises and durations, meal suggestions with actual food items, and weekly progress guidance. Make it personalized based on the user's profile.`;

//     const completion = await groq.chat.completions.create({
//       model: "llama-3.1-70b-versatile",
//       temperature: 0.8,
//       max_tokens: 1000,
//       response_format: { type: "json_object" },
//       messages: [
//         {
//           role: "system",
//           content: `You are an expert fitness and nutrition coach. Generate personalized, actionable plans based on user data. 
// Return a JSON object with these exact keys:
// - calorieTarget: number (daily calorie target)
// - workoutPlan: array of 4-6 strings (specific workout exercises/routines, e.g., "30 min morning jog", "Upper body: 3x8 bench press, 3x10 rows")
// - mealPlan: object with keys breakfast, lunch, dinner, snacks (each a string describing the meal)
// - weeklyProgress: string (1-2 sentences of personalized guidance)

// Make the suggestions specific, varied, and tailored to the user's age, weight, height, activity level, and goal. Avoid generic responses.`,
//         },
//         {
//           role: "user",
//           content: userPrompt,
//         },
//       ],
//     });

//     const content = completion.choices?.[0]?.message?.content || "{}";
//     console.log("Groq AI Response (raw):", content);

//     // Clean and parse JSON (handles fenced code blocks if any)
//     const cleaned = content.replace(/```json|```/gi, "").trim();
//     let parsed = null;
//     try {
//       parsed = JSON.parse(cleaned);
//     } catch (parseErr) {
//       // Try to extract JSON substring
//       const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         parsed = JSON.parse(jsonMatch[0]);
//       } else {
//         console.error("JSON Parse Error:", parseErr);
//         throw new Error("Failed to parse AI response");
//       }
//     }

//     if (!parsed || typeof parsed !== "object") {
//       throw new Error("Invalid AI response structure");
//     }

//     const response = {
//       calorieTarget: parsed.calorieTarget ?? calorieTarget,
//       workoutPlan: Array.isArray(parsed.workoutPlan) ? parsed.workoutPlan : [],
//       mealPlan: parsed.mealPlan ?? {},
//       weeklyProgress: parsed.weeklyProgress ?? "",
//       source: "groq",
//     };

//     console.log("Final Response:", response);
//     return res.json(response);
//   } catch (err) {
//     console.error("Groq AI error:", err?.response?.data || err?.message || err);
//     console.error("Error stack:", err?.stack);
//     return res.status(502).json({
//       error: "AI generation failed",
//       detail: err?.message || "Unknown error",
//     });
//   }
// };

import Groq from "groq-sdk";

// Fallback plan if AI fails or for dev testing
const fallbackPlan = (goal, activity, calorieTarget, bmi = null) => ({
  calorieTarget,
  bmi: bmi,
  workoutPlan: [
    "30 min brisk cardio",
    "20 min strength (squats, pushups, rows)",
    "10 min core (planks, dead bugs)",
    "10 min mobility & stretch",
  ],
  mealPlan: {
    breakfast: "Oats + berries + yogurt",
    lunch: "Grilled chicken + rice + veggies",
    dinner: "Fish + quinoa + greens",
    snacks: "Fruit, nuts, Greek yogurt",
  },
  weeklyProgress:
    goal === "lose"
      ? "Aim for 0.5-1 kg loss per week; adjust calories if plateaus."
      : goal === "gain"
      ? "Target 0.25-0.5 kg gain per week; prioritize strength progress."
      : "Maintain weight; focus on performance and recovery.",
  source: "fallback",
});

export const generateAI = async (req, res) => {
  const { age, weight, height, activity, goal } = req.body;

  // Basic validation
  const ageNum = Number(age);
  const weightNum = Number(weight);
  const heightNum = Number(height);
  const activityLevel = activity || "medium";
  const goalType = goal || "maintain";

  if (!ageNum || !weightNum || !heightNum) {
    return res.status(400).json({
      error: "Invalid input. Please provide valid age, weight, and height.",
    });
  }

  // Calculate BMI
  const heightInMeters = heightNum / 100;
  const bmi = weightNum / (heightInMeters * heightInMeters);
  const bmiRounded = Math.round(bmi * 10) / 10;

  // Calculate basic calorie target
  const BMR = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
  let calorieTarget =
    activityLevel === "low"
      ? BMR * 1.2
      : activityLevel === "medium"
      ? BMR * 1.55
      : BMR * 1.75;
  if (goalType === "lose") calorieTarget -= 500;
  if (goalType === "gain") calorieTarget += 500;
  calorieTarget = Math.round(calorieTarget);

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return res.status(500).json({
      error:
        "Missing GROQ_API_KEY. Add it to backend/.env and restart the server.",
      fallback: fallbackPlan(goalType, activityLevel, calorieTarget, bmiRounded),
    });
  }

  const groq = new Groq({ apiKey: groqApiKey });

  try {
    const userPrompt = `Create a personalized fitness plan for:
- Age: ${ageNum} years
- Weight: ${weightNum} kg
- Height: ${heightNum} cm
- Activity Level: ${activityLevel}
- Goal: ${
      goalType === "lose"
        ? "Lose weight"
        : goalType === "gain"
        ? "Gain weight"
        : "Maintain weight"
    }
- Suggested Daily Calories: ${calorieTarget}

Include:
- Daily Workout Plan (4-6 exercises)
- Daily Meal Plan (breakfast, lunch, dinner, snacks)
- Weekly Progress Advice`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // UPDATED MODEL
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a fitness and nutrition coach. Return JSON with keys: calorieTarget, workoutPlan, mealPlan, weeklyProgress.`,
        },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices?.[0]?.message?.content || "{}";

    // Clean JSON
    const cleaned = content.replace(/```json|```/gi, "").trim();
    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = fallbackPlan(goalType, activityLevel, calorieTarget, bmiRounded);
    }

    const response = {
      calorieTarget: parsed.calorieTarget ?? calorieTarget,
      bmi: bmiRounded,
      workoutPlan: Array.isArray(parsed.workoutPlan)
        ? parsed.workoutPlan
        : fallbackPlan(goalType, activityLevel, calorieTarget, bmiRounded).workoutPlan,
      mealPlan:
        parsed.mealPlan ??
        fallbackPlan(goalType, activityLevel, calorieTarget, bmiRounded).mealPlan,
      weeklyProgress:
        parsed.weeklyProgress ??
        fallbackPlan(goalType, activityLevel, calorieTarget, bmiRounded).weeklyProgress,
      source: "groq",
    };

    return res.json(response);
  } catch (err) {
    console.error("Groq AI error:", err?.message || err);
    return res.status(502).json({
      error: "AI generation failed",
      detail: err?.message || "Unknown error",
      fallback: { ...fallbackPlan(goalType, activityLevel, calorieTarget), bmi: bmiRounded },
    });
  }
};
