import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingScreen from './components/LandingScreen';
import ExamInputScreen from './components/ExamInputScreen';
import PreferenceScreen from './components/PreferenceScreen';
import SuggestionsScreen from './components/SuggestionsScreen';
import GuidanceScreen from './components/GuidanceScreen';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Chatbot from './components/Chatbot';
import CursorField from './components/CursorField';
import { getCollegeSuggestions, getApplicationGuidance } from './api/ai';
import { BRANCH_OPTIONS, CAREER_GOALS, BUDGET_OPTIONS, LOCATION_OPTIONS, COLLEGE_TYPES, CATEGORY_OPTIONS, HOSTEL_OPTIONS, GENDER_PREF_OPTIONS, EXAM_LIST } from './data/constants';
import { saveSession, loadSession, saveToSearchHistory } from './data/storage';

// Default initial state for preferences
const DEFAULT_PREFERENCES = {
  branch: [BRANCH_OPTIONS[0]],
  careerGoal: CAREER_GOALS[0],
  budget: BUDGET_OPTIONS[0],
  location: LOCATION_OPTIONS[0],
  collegeType: COLLEGE_TYPES[0],
  category: CATEGORY_OPTIONS[0],
  hostel: HOSTEL_OPTIONS[0],
  genderPref: GENDER_PREF_OPTIONS[0],
  additionalInfo: '',
};

const DEFAULT_EXAM_SCORES = [{ exam: EXAM_LIST[0].name, score: '', type: EXAM_LIST[0].scoreType }];

function App() {
  // Load stored data (and screen position) on first mount
  const loaded = loadSession();

  const [currentScreen, setCurrentScreen] = useState(loaded.currentScreen || 0);
  const [transitioning, setTransitioning] = useState(false);

  const [examScores, setExamScores] = useState(
    Array.isArray(loaded.examScores) ? loaded.examScores : DEFAULT_EXAM_SCORES
  );
  const [preferences, setPreferences] = useState(
    loaded.preferences || DEFAULT_PREFERENCES
  );
  const [suggestions, setSuggestions] = useState(Array.isArray(loaded.suggestions) ? loaded.suggestions : []);
  const [selectedColleges, setSelectedColleges] = useState(Array.isArray(loaded.selectedColleges) ? loaded.selectedColleges : []);
  const [guidance, setGuidance] = useState(loaded.guidance || null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    saveSession({ examScores, preferences, suggestions, selectedColleges, guidance, currentScreen });
  }, [examScores, preferences, suggestions, selectedColleges, guidance, currentScreen]);

  // Animated screen transition helper
  const navigateTo = (screen) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 180);
  };

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Analyzing your profile and finding the best colleges...');
    try {
      const results = await getCollegeSuggestions(examScores, preferences);
      if (results && results.length > 0) {
        setSuggestions(results);
        saveToSearchHistory(examScores, preferences, results.length);
        navigateTo(3);
      } else {
        throw new Error('Received empty suggestions from AI.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch college suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetGuidance = async (colleges) => {
    setSelectedColleges(colleges);
    setIsLoading(true);
    setError(null);
    setLoadingMessage(`Generating comprehensive application roadmap for ${colleges.length} colleges...`);
    try {
      const result = await getApplicationGuidance(colleges, examScores, preferences);
      if (result && result.guidanceList && Array.isArray(result.guidanceList)) {
        setGuidance(result);
        navigateTo(4);
      } else {
        throw new Error('Received incomplete guidance from AI.');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate application guidance.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setExamScores(DEFAULT_EXAM_SCORES);
    setSuggestions([]);
    setSelectedColleges([]);
    setGuidance(null);
    setError(null);
    setPreferences(DEFAULT_PREFERENCES);
    navigateTo(0);
  };

  const showScreen = !isLoading && !error;
  const screenClass = `screen-wrapper${transitioning ? ' page-exit-active' : ' page-enter-active'}`;

  return (
    <>
      {/* Cursor-following particle canvas — fixed, behind everything */}
      <CursorField />

      <div className="app-container">
        <Header />

        {/* Step Progress Bar */}
        {showScreen && currentScreen >= 1 && (
          <div className="progress-bar">
            {[1, 2, 3, 4].map((n, i, arr) => (
              <React.Fragment key={n}>
                <div
                  className={`progress-dot ${
                    currentScreen > n ? 'done' : currentScreen === n ? 'active' : ''
                  }`}
                  title={`Step ${n}`}
                />
                {i < arr.length - 1 && (
                  <div className="progress-line-small" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingSpinner message={loadingMessage} />}

        {/* Error */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => {
              setError(null);
              if (currentScreen === 2) handleGetSuggestions();
              if (currentScreen === 3) handleGetGuidance(selectedColleges);
            }}
          />
        )}

        {/* Global Navigation Bar */}
        {showScreen && currentScreen > 0 && (
          <div className="global-nav">
            <button className="btn btn-secondary" onClick={() => navigateTo(0)} style={{ padding: '8px 16px', fontSize: '14px' }}>
              Start Over
            </button>
            <div className="global-nav-buttons">
              {currentScreen > 1 && (
                <button className="btn btn-secondary" onClick={() => navigateTo(currentScreen - 1)} style={{ padding: '8px 16px', fontSize: '14px' }}>
                  Back
                </button>
              )}
            </div>
          </div>
        )}

        {/* Screens — always start at 0 on fresh load */}
        {showScreen && currentScreen === 0 && (
          <div className={screenClass}>
            <LandingScreen onGetStarted={() => navigateTo(1)} />
          </div>
        )}
        {showScreen && currentScreen === 1 && (
          <div className={screenClass}>
            <ExamInputScreen
              examScores={examScores}
              setExamScores={setExamScores}
              onNext={() => navigateTo(2)}
            />
          </div>
        )}
        {showScreen && currentScreen === 2 && (
          <div className={screenClass}>
            <PreferenceScreen
              preferences={preferences}
              setPreferences={setPreferences}
              onBack={() => navigateTo(1)}
              onSubmit={handleGetSuggestions}
            />
          </div>
        )}
        {showScreen && currentScreen === 3 && (
          <div className={screenClass}>
            <SuggestionsScreen
              suggestions={suggestions}
              onGetGuidance={handleGetGuidance}
              onStartOver={handleStartOver}
              examScores={examScores}
              preferences={preferences}
              selectedColleges={selectedColleges}
              setSelectedColleges={setSelectedColleges}
            />
          </div>
        )}
        {showScreen && currentScreen === 4 && guidance && (
          <div className={screenClass}>
            <GuidanceScreen
              guidance={guidance}
              colleges={selectedColleges}
              preferences={preferences}
              examScores={examScores}
              onBack={() => navigateTo(3)}
            />
          </div>
        )}

        <footer className="footer">
          <p>
            Built for{' '}
            <span className="footer-highlight">SDG 4: Quality Education</span>
            {' & '}
            <span className="footer-highlight">SDG 10: Reduced Inequalities</span>
          </p>
          <p style={{ marginTop: '6px', fontSize: '12px' }}>
            Democratizing college admission guidance for every Indian student.
          </p>
        </footer>

        <Chatbot examScores={examScores} preferences={preferences} />
      </div>
    </>
  );
}

export default App;
