import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import InputForm from "./components/InputForm";
import Result from "./components/Result";
import "./App.css";

function HeroPage({ onStart, onReset, hasData }) {
  return (
    <section className="page page--hero" id="intro">
      <header className="hero">
        <span className="hero__tag">AI Fitness Planner</span>
        <h1>Design your personal fitness and nutrition plan in seconds</h1>
        <p className="hero__subtitle">
          Enter a few details and let the AI tailor your workouts and meals to your goals. Clear,
          actionable guidance without the guesswork.
        </p>
<<<<<<< HEAD
        <div className="hero-actions">
          <button className="button primary button-small" onClick={onStart}>
            Get started
          </button>
          {hasData && (
            <button className="button ghost button-small" onClick={onReset}>
              Start over
            </button>
          )}
        </div>
      </header>
    </section>



=======
      </header>
    </section>
>>>>>>> 4fda20d73603937bfe2d605b595fc075e81f9452
  );
}

function PlanPage({ onGenerate }) {
  return (
    <section className="page page--form" id="plan">
      <main className="content">
        <InputForm onGenerate={onGenerate} />
      </main>
    </section>
  );
}

function SuggestionsPage({ data, onReset, onStart }) {
  return (
    <section className="page page--suggestions" id="suggestions">
      <main className="content">
        {data ? (
          <Result data={data} onReset={onReset} />
        ) : (
          <section className="card empty-state">
            <div className="card__head">
              <div>
                <p className="eyebrow">Step 3</p>
                <h2>Suggestions land here</h2>
                <p className="muted">
                  Generate your plan in step two to see tailored workouts, meals, and weekly
                  progress cues.
                </p>
              </div>
              <div className="badge accent">AI ready</div>
            </div>
            <div className="empty-hints">
              <div className="hint">
                <div className="feature-icon">⚡</div>
                <p className="muted">Fast insights on your optimal training split.</p>
              </div>
              <div className="hint">
                <div className="feature-icon">🍱</div>
                <p className="muted">Balanced meals with macros that fit your goal.</p>
              </div>
              <div className="hint">
                <div className="feature-icon">📈</div>
                <p className="muted">Weekly cues to adjust calories or effort.</p>
              </div>
            </div>
            <div className="actions">
              <button className="button ghost button-small" onClick={onStart}>
                Go to the form
              </button>
            </div>
          </section>
        )}
      </main>
    </section>
  );
}

function App() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleStart = () => {
    setData(null);
    navigate("/plan");
  };

  const handleGenerate = (payload) => {
    setData(payload);
    navigate("/suggestions");
  };

  const handleReset = () => {
    setData(null);
    navigate("/plan");
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={<HeroPage onStart={handleStart} onReset={handleReset} hasData={!!data} />}
        />
        <Route path="/plan" element={<PlanPage onGenerate={handleGenerate} />} />
        <Route
          path="/suggestions"
          element={<SuggestionsPage data={data} onReset={handleReset} onStart={handleStart} />}
        />
      </Routes>

      <footer className="footer">
        <div className="footer__meta">
          <span>Built for healthy habits</span>
          <span className="dot" />
          <span>Backed by AI insights</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
