import { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Filter } from 'lucide-react';
import CollegeCard from './CollegeCard';

function SuggestionsScreen({ suggestions, selectedColleges, setSelectedColleges, onGetGuidance, onStartOver }) {
  const [filterType, setFilterType] = useState('All');
  const [filterChance, setFilterChance] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterUniversity, setFilterUniversity] = useState('All');
  const [filterExam, setFilterExam] = useState('All');

  // Extract unique filter options from the suggestions data
  const uniqueTypes = ['All', ...new Set(suggestions.map(c => c.type).filter(Boolean))];
  const uniqueUniversities = ['All', ...new Set(suggestions.map(c => c.university).filter(Boolean))];
  const uniqueLocations = ['All', ...new Set(suggestions.map(c => c.location).filter(Boolean))];
  const uniqueExams = ['All', ...new Set(suggestions.map(c => c.acceptedExam).filter(Boolean))];

  // Apply filters
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(c => {
      if (filterType !== 'All' && c.type !== filterType) return false;
      if (filterChance !== 'All' && c.admissionChance !== filterChance) return false;
      if (filterLocation !== 'All' && c.location !== filterLocation) return false;
      if (filterUniversity !== 'All' && c.university !== filterUniversity) return false;
      if (filterExam !== 'All' && c.acceptedExam !== filterExam) return false;
      return true;
    });
  }, [suggestions, filterType, filterChance, filterLocation, filterUniversity, filterExam]);

  const handleToggleSelect = (college) => {
    const isAlreadySelected = selectedColleges.some(c => c.name === college.name);
    if (isAlreadySelected) {
      setSelectedColleges(selectedColleges.filter(c => c.name !== college.name));
    } else {
      setSelectedColleges([...selectedColleges, college]);
    }
  };

  return (
    <div className="screen-wrapper" style={{ paddingBottom: '100px' }}>
      <h1 className="screen-title" style={{ textAlign: 'center' }}>AI College <span>Matches</span></h1>
      <p className="screen-description" style={{ textAlign: 'center' }}>
        Found {suggestions.length} colleges. Select the ones you want comprehensive guidance for.
      </p>

      {/* Dynamic Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          <Filter size={20} color="var(--primary)" /> Filters:
        </div>
        
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="All">Type: All</option>
          {uniqueTypes.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        
        <select value={filterUniversity} onChange={e => setFilterUniversity(e.target.value)}>
          <option value="All">University: All</option>
          {uniqueUniversities.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={filterExam} onChange={e => setFilterExam(e.target.value)}>
          <option value="All">Exam Route: All</option>
          {uniqueExams.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={filterChance} onChange={e => setFilterChance(e.target.value)}>
          <option value="All">Chance: All</option>
          <option value="High">Chance: High</option>
          <option value="Medium">Chance: Medium</option>
          <option value="Low">Chance: Low</option>
        </select>

        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
          <option value="All">Location: All</option>
          {uniqueLocations.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="college-grid">
        {filteredSuggestions.map((college, idx) => (
          <div key={idx} className={`stagger-${(idx % 10) + 1}`}>
            <CollegeCard 
              college={college} 
              isSelected={selectedColleges.some(c => c.name === college.name)}
              onToggleSelect={handleToggleSelect}
            />
          </div>
        ))}
        {filteredSuggestions.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--on-surface-muted)' }}>
            No colleges match the selected filters.
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)', borderRadius: 'var(--r-full)',
        padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '24px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)', zIndex: 50
      }}>
        <div style={{ fontWeight: '600', fontSize: '18px' }}>
          Selected: <span style={{ color: 'var(--primary)' }}>{selectedColleges.length}</span>
        </div>
        <button 
          className="btn btn-accent" 
          onClick={() => onGetGuidance(selectedColleges)}
          disabled={selectedColleges.length === 0}
        >
          Get Mega-Guidance
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default SuggestionsScreen;
