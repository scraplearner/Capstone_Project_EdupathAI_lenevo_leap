import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { EXAM_LIST } from '../data/constants';

function ExamInputScreen({ examScores, setExamScores, onNext }) {
  const handleAddExam = () => {
    setExamScores([...examScores, { exam: EXAM_LIST[0].name, score: '', type: EXAM_LIST[0].scoreType }]);
  };

  const handleRemoveExam = (index) => {
    const updated = examScores.filter((_, i) => i !== index);
    setExamScores(updated);
  };

  const handleExamChange = (index, field, value) => {
    const updated = [...examScores];
    if (field === 'exam') {
      const selectedExam = EXAM_LIST.find((e) => e.name === value);
      updated[index] = { ...updated[index], exam: value, type: selectedExam?.scoreType || 'score', score: '' };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setExamScores(updated);
  };

  const handleKeyDown = (e) => {
    // Prevent typing 'e', '+', '-', '.' into number fields unless it's a valid float
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const isFormValid = examScores.length > 0 && examScores.every((e) => e.score.toString().trim() !== '');

  return (
    <div className="screen-wrapper">
      <h1 className="screen-title" style={{ textAlign: 'center' }}>Enter Your <span>Scores</span></h1>
      <p className="screen-description" style={{ textAlign: 'center' }}>
        Provide your entrance exam details so we can find colleges that match your academic profile.
      </p>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {examScores.map((entry, idx) => (
          <div key={idx} className="exam-entry">
            <div className="form-group">
              <label className="form-label">Exam Name</label>
              <select
                className="form-select"
                value={entry.exam}
                onChange={(e) => handleExamChange(idx, 'exam', e.target.value)}
              >
                {EXAM_LIST.map((e) => (
                  <option key={e.name} value={e.name}>
                    {e.name} ({e.scoreType})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Your {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
              </label>
              <input
                type="number"
                min="0"
                step={entry.type === 'percentile' ? '0.01' : '1'}
                className="form-input"
                placeholder={`Enter ${entry.type}`}
                value={entry.score}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  let val = e.target.value;
                  // Strict validation bounds
                  if (val !== '') {
                    const num = parseFloat(val);
                    if (num < 0) val = '0';
                    if (entry.type === 'percentile' && num > 100) val = '100';
                  }
                  handleExamChange(idx, 'score', val);
                }}
              />
            </div>

            {examScores.length > 1 && (
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => handleRemoveExam(idx)}
                style={{ marginBottom: '24px', flexShrink: 0 }}
                title="Remove Exam"
              >
                <Trash2 size={18} color="var(--danger)" />
              </button>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={handleAddExam}>
            <Plus size={18} />
            Add Another Exam
          </button>

          <button className="btn btn-primary" onClick={onNext} disabled={!isFormValid}>
            Next Step
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamInputScreen;
