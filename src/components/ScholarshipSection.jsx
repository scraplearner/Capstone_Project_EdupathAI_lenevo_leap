import { useState, useEffect } from 'react';
import { Award, ExternalLink, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { getScholarships } from '../api/ai';

function ScholarshipSection({ college, preferences }) {
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchScholarships() {
      setIsLoading(true);
      setError(null);
      try {
        const results = await getScholarships(college, preferences);
        if (isMounted) setScholarships(results);
      } catch (err) {
        if (isMounted) setError("Could not load scholarships at this time.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchScholarships();
    
    return () => { isMounted = false; };
  }, [college, preferences]);

  if (isLoading) {
    return (
      <div className="guidance-section stagger-5">
        <div className="guidance-section-title">
          <div className="icon" style={{ background: 'rgba(26, 127, 66, 0.2)', color: 'var(--success)' }}>
            <Award size={18} />
          </div>
          Finding Scholarships...
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
          <div style={{ animation: 'pulse 1.5s infinite' }}>Analyzing profile for financial aid...</div>
        </div>
      </div>
    );
  }

  if (error || scholarships.length === 0) {
    return null; // Hide section if it fails or returns nothing
  }

  return (
    <div className="guidance-section stagger-5">
      <div className="guidance-section-title">
        <div className="icon" style={{ background: 'rgba(26, 127, 66, 0.2)', color: 'var(--success)' }}>
          <Award size={18} />
        </div>
        Recommended Scholarships
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {scholarships.map((scholarship, idx) => (
          <div key={idx} style={{ 
            background: 'rgba(255, 255, 255, 0.5)', 
            border: '1px solid var(--outline-variant)',
            borderTop: '3px solid var(--success)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--on-surface)', lineHeight: '1.4' }}>
              {scholarship.name}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--on-surface-variant)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IndianRupee size={14} color="var(--success)" /> 
                <span style={{ fontWeight: '600', color: 'var(--on-surface)' }}>{scholarship.amount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> 
                <span>Deadline: {scholarship.deadline}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <CheckCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                <span style={{ lineHeight: '1.4' }}>{scholarship.eligibility}</span>
              </div>
            </div>
            
            {scholarship.link && (
              <a 
                href={scholarship.link.startsWith('http') ? scholarship.link : `https://${scholarship.link}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  marginTop: 'auto', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--outline-variant)'
                }}
              >
                Apply Here <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScholarshipSection;
