export default function Result({ data, onReset }) {
  const renderTextLike = (value) => {
    if (value == null) return null;
    if (typeof value === "string" || typeof value === "number") return value;
    if (Array.isArray(value)) return value.map(renderTextLike).join(", ");
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1")}: ${renderTextLike(v)}`)
        .join(", ");
    }
    return String(value);
  };

  const renderWeeklyProgress = (progress) => {
    if (typeof progress === "string" || typeof progress === "number") {
      return <p>{progress}</p>;
    }

    if (Array.isArray(progress)) {
      return (
        <ul className="progress-list">
          {progress.map((item, idx) => (
            <li key={idx}>{renderTextLike(item)}</li>
          ))}
        </ul>
      );
    }

    if (progress && typeof progress === "object") {
      return (
        <ul className="progress-list">
          {Object.entries(progress).map(([key, value]) => (
            <li key={key}>
              <strong>{key.replace(/([A-Z])/g, " $1")}</strong>: {renderTextLike(value)}
            </li>
          ))}
        </ul>
      );
    }

    return <p className="muted">Weekly guidance will appear here once generated.</p>;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (bmi < 25) return { label: "Normal", color: "#10b981" };
    if (bmi < 30) return { label: "Overweight", color: "#f59e0b" };
    return { label: "Obese", color: "#ef4444" };
  };

  const calculateMealCalories = (mealType) => {
    const totalCalories = data.calorieTarget || 2000;
    // Distribute calories: Breakfast 25%, Lunch 35%, Dinner 30%, Snacks 10%
    const distribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snacks: 0.10,
    };
    return Math.round(totalCalories * (distribution[mealType] || 0));
  };

  const bmiCategory = data.bmi ? getBMICategory(data.bmi) : null;

  return (
    <section className="card result-card">
      <div className="plan-header-banner">
        <div className="plan-header-content">
          <div className="plan-status-badge">
            <span className="status-dot"></span>
            <span>Plan ready</span>
          </div>
          <h2 className="plan-title">Your AI Fitness Plan</h2>
          <p className="plan-description">
            Consistent effort beats intensity. Follow the schedule and adjust
            weekly with your progress check.
          </p>
        </div>
      </div>

      <div className="metrics-display">
        <div className="metric-stat-card calories-stat">
          <div className="stat-content">
            <div className="stat-value">{data.calorieTarget || 'N/A'}</div>
            <div className="stat-label">Daily Calorie Target</div>
            <div className="stat-unit">Total calories per day</div>
          </div>
        </div>
        {data.bmi && (
          <div className="metric-stat-card bmi-stat" style={{ '--bmi-color': bmiCategory?.color }}>
            <div className="stat-content">
              <div className="stat-value" style={{ color: bmiCategory?.color }}>{data.bmi}</div>
              <div className="stat-label">Body Mass Index</div>
              <div className="stat-unit">Status: {bmiCategory?.label}</div>
            </div>
          </div>
        )}
      </div>

      <div className="result-grid">
        <section className="result-section">
          <div className="section-head">
            <div className="section-header-with-image">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=120&fit=crop&auto=format" 
                alt="Workout" 
                className="section-header-image"
              />
              <div>
                <h3>Workout Plan</h3>
                <p className="muted">Keep movements controlled and focus on form.</p>
              </div>
            </div>
          </div>
          <div className="pill-list">
            {(data.workoutPlan || []).map((w, i) => (
              <span key={i} className="pill" style={{ animationDelay: `${i * 0.1}s` }}>
                {renderTextLike(w)}
              </span>
            ))}
          </div>
        </section>

        <section className="result-section">
          <div className="section-head">
            <div className="section-header-with-image">
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=120&h=120&fit=crop&auto=format" 
                alt="Meal Plan" 
                className="section-header-image"
              />
              <div>
                <h3>Meal Plan</h3>
                <p className="muted">Balanced macros with smart snacks.</p>
              </div>
            </div>
          </div>
          <div className="meal-grid">
            <div className="meal-card">
              <div className="meal-card-header">
                <p className="eyebrow">Breakfast</p>
                <div className="meal-calories">{calculateMealCalories('breakfast')} cal</div>
              </div>
              <p>{renderTextLike(data.mealPlan.breakfast)}</p>
            </div>
            <div className="meal-card">
              <div className="meal-card-header">
                <p className="eyebrow">Lunch</p>
                <div className="meal-calories">{calculateMealCalories('lunch')} cal</div>
              </div>
              <p>{renderTextLike(data.mealPlan.lunch)}</p>
            </div>
            <div className="meal-card">
              <div className="meal-card-header">
                <p className="eyebrow">Dinner</p>
                <div className="meal-calories">{calculateMealCalories('dinner')} cal</div>
              </div>
              <p>{renderTextLike(data.mealPlan.dinner)}</p>
            </div>
            <div className="meal-card">
              <div className="meal-card-header">
                <p className="eyebrow">Snacks</p>
                <div className="meal-calories">{calculateMealCalories('snacks')} cal</div>
              </div>
              <p>{renderTextLike(data.mealPlan.snacks)}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="result-section">
        <div className="section-head">
          <h3>Weekly Progress</h3>
          <p className="muted">Review trends and adjust intensity or calories.</p>
        </div>
        <div className="progress-box">
          {renderWeeklyProgress(data.weeklyProgress)}
        </div>
      </section>
    </section>
  );
}
