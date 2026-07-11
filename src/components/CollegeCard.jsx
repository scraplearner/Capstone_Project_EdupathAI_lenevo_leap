import { MapPin, Target, DollarSign, Building, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';

function CollegeCard({ college, isSelected, onToggleSelect }) {
  const chanceClass = `chance-${college.admissionChance?.toLowerCase() || 'med'}`;
  
  return (
    <div 
      className={`college-card ${isSelected ? 'selected' : ''}`}
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid var(--primary)' : '',
        transform: isSelected ? 'translateY(-4px)' : '',
        boxShadow: isSelected ? '0 16px 32px rgba(139, 92, 246, 0.3)' : ''
      }}
      onClick={() => onToggleSelect(college)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 className="college-name">{college.name}</h3>
          <div className="college-location" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} />
            {college.location}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {/* Checkbox Icon */}
          <div style={{ 
            width: '28px', height: '28px', borderRadius: '8px', 
            border: isSelected ? 'none' : '2px solid var(--glass-border)',
            background: isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {isSelected && <CheckCircle2 size={18} color="white" />}
          </div>
          <span className={`chance-badge ${chanceClass}`}>
            {college.admissionChance} Chance
          </span>
        </div>
      </div>

      <div className="college-stats">
        <div className="stat-item">
          <div className="stat-label"><GraduationCap size={12} style={{ display: 'inline', marginRight: '4px' }}/> Branch</div>
          <div className="stat-value">{college.branch}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label"><DollarSign size={12} style={{ display: 'inline', marginRight: '4px' }}/> Annual Fees</div>
          <div className="stat-value">{college.annualFees}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label"><Target size={12} style={{ display: 'inline', marginRight: '4px' }}/> Avg Placement</div>
          <div className="stat-value">{college.avgPlacement}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label"><Building size={12} style={{ display: 'inline', marginRight: '4px' }}/> NIRF Rank</div>
          <div className="stat-value">{college.nirfRank}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="stat-item" style={{ background: 'rgba(56, 189, 248, 0.1)' }}>
          <div className="stat-label" style={{ color: 'var(--secondary)' }}>Type</div>
          <div className="stat-value" style={{ fontSize: '14px' }}>{college.type || 'N/A'}</div>
        </div>
        <div className="stat-item" style={{ background: 'rgba(244, 114, 182, 0.1)' }}>
          <div className="stat-label" style={{ color: 'var(--tertiary)' }}><Building2 size={12} style={{ display: 'inline', marginRight: '4px' }}/> University</div>
          <div className="stat-value" style={{ fontSize: '14px' }}>{college.university || 'N/A'}</div>
        </div>
        <div className="stat-item" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
          <div className="stat-label" style={{ color: 'var(--primary)' }}>Accepted Exam</div>
          <div className="stat-value" style={{ fontSize: '14px' }}>{college.acceptedExam || college.examRoute || 'N/A'}</div>
        </div>
      </div>

      <div style={{
        marginTop: 'auto',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        fontSize: '14px',
        color: 'var(--on-surface-muted)',
        borderLeft: '4px solid var(--primary)'
      }}>
        <strong style={{ color: 'var(--on-surface)' }}>AI Match Reason:</strong> {college.reason}
      </div>
    </div>
  );
}

export default CollegeCard;
