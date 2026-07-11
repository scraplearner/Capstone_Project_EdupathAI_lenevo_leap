import { useState } from 'react';
import { ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { BRANCH_OPTIONS, CAREER_GOALS, BUDGET_OPTIONS, LOCATION_OPTIONS, COLLEGE_TYPES, CATEGORY_OPTIONS, HOSTEL_OPTIONS, GENDER_PREF_OPTIONS } from '../data/constants';

function PreferenceScreen({ preferences, setPreferences, onBack, onSubmit }) {
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (field, value) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const handleNextClick = () => {
    // Check if ALL major criteria are effectively "Any" or "Undecided"
    const isUndecided = 
      Array.isArray(preferences.branch) && preferences.branch.length === 1 && preferences.branch[0] === BRANCH_OPTIONS[0] &&
      preferences.careerGoal === CAREER_GOALS[0] &&
      preferences.location === LOCATION_OPTIONS[0] &&
      preferences.collegeType === COLLEGE_TYPES[0];

    if (isUndecided) {
      setShowWarning(true);
    } else {
      onSubmit();
    }
  };

  return (
    <div className="screen-wrapper">
      <h1 className="screen-title" style={{ textAlign: 'center' }}>Set Your <span>Preferences</span></h1>
      <p className="screen-description" style={{ textAlign: 'center' }}>
        Tell us what you're looking for in a college.
      </p>

      {/* Warning Modal */}
      {showWarning && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="var(--warning)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--warning)', marginBottom: '8px' }}>Too Broad!</h3>
            <p style={{ color: 'var(--on-surface-muted)', marginBottom: '24px' }}>
              You have selected "Any" or "Undecided" for Branch, Career Goal, Location, and College Type. 
              This will result in a vast and unfocused list of colleges. 
              Please narrow down at least one preference to get useful AI matches.
            </p>
            <button className="btn btn-primary" onClick={() => setShowWarning(false)}>
              Adjust Preferences
            </button>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        <h3 className="section-heading">Academic & Career Goals</h3>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Preferred Branches (Select multiple)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {BRANCH_OPTIONS.map((opt) => {
              const isSelected = Array.isArray(preferences.branch) && preferences.branch.includes(opt);
              return (
                <button
                  key={opt}
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', fontSize: '14px', borderRadius: 'var(--r-full)' }}
                  onClick={() => {
                    let newBranch = Array.isArray(preferences.branch) ? [...preferences.branch] : [];
                    if (isSelected) {
                      newBranch = newBranch.filter(b => b !== opt);
                      if (newBranch.length === 0) newBranch = [BRANCH_OPTIONS[0]]; // Prevents empty state
                    } else {
                      newBranch.push(opt);
                    }
                    handleChange('branch', newBranch);
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
        <div className="dynamic-split" style={{ marginBottom: '32px' }}>
          <div className="form-group">
            <label className="form-label">Career Goal</label>
            <select className="form-select" value={preferences.careerGoal} onChange={(e) => handleChange('careerGoal', e.target.value)}>
              {CAREER_GOALS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <h3 className="section-heading">Location & Institution Type</h3>
        <div className="dynamic-split" style={{ marginBottom: '32px' }}>
          <div className="form-group">
            <label className="form-label">Location Preference</label>
            <select className="form-select" value={preferences.location} onChange={(e) => handleChange('location', e.target.value)}>
              {LOCATION_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">College Type</label>
            <select className="form-select" value={preferences.collegeType} onChange={(e) => handleChange('collegeType', e.target.value)}>
              {COLLEGE_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Institution Type (Gender)</label>
            <select className="form-select" value={preferences.genderPref} onChange={(e) => handleChange('genderPref', e.target.value)}>
              {GENDER_PREF_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <h3 className="section-heading">Personal Requirements</h3>
        <div className="dynamic-split" style={{ marginBottom: '32px' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={preferences.category} onChange={(e) => handleChange('category', e.target.value)}>
              {CATEGORY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Annual Budget</label>
            <select className="form-select" value={preferences.budget} onChange={(e) => handleChange('budget', e.target.value)}>
              {BUDGET_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Hostel Requirement</label>
            <select className="form-select" value={preferences.hostel} onChange={(e) => handleChange('hostel', e.target.value)}>
              {HOSTEL_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <h3 className="section-heading">Additional Context</h3>
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="form-label">Anything else we should know? (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="e.g., I want a college with a good robotics club, or I prefer colleges with strong alumni networks in the US."
            value={preferences.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={18} />
            Back
          </button>

          <button className="btn btn-primary" onClick={handleNextClick}>
            Get College Matches
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferenceScreen;
