import { useRef, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, Calendar, AlertCircle, FileText, CheckCircle, GraduationCap, DollarSign, Landmark, Building, Briefcase, Target } from 'lucide-react';

function GuidanceScreen({ guidance, colleges, examScores, preferences, onBack }) {
  const reportRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!window.html2pdf) {
      alert("PDF library is still loading. Please try again in a few seconds.");
      return;
    }
    
    setIsGeneratingPDF(true);
    const element = reportRef.current;
    
    // Temporarily adjust styles for PDF rendering if needed
    const originalBackground = element.style.background;
    const originalColor = element.style.color;
    element.style.background = '#ffffff';
    element.style.color = '#000000';

    const opt = {
      margin: 10,
      filename: `EduPathAI_Guidance_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await window.html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Failed to generate PDF. See console for details.");
    } finally {
      element.style.background = originalBackground;
      element.style.color = originalColor;
      setIsGeneratingPDF(false);
    }
  };

  if (!guidance || !guidance.guidanceList) return null;

  return (
    <div className="screen-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="screen-title" style={{ marginBottom: '8px' }}>Mega <span>Guidance Report</span></h1>
          <p className="screen-description" style={{ marginBottom: 0 }}>
            Comprehensive admission roadmaps for your {colleges.length} selected colleges.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={18} /> Back
          </button>
          <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
            <Download size={18} />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* This ref acts as the container for the PDF generator */}
      <div ref={reportRef} style={{ background: 'var(--bg)', color: 'var(--on-surface)', padding: '20px' }}>
        
        {/* PDF Header - Profile Context */}
        <div className="glass-card" style={{ marginBottom: '40px', pageBreakAfter: 'always' }}>
          <h2 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '16px', marginBottom: '24px' }}>
            Applicant Profile
          </h2>
          <div className="dynamic-split">
            <div>
              <h4 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18}/> Exam Inputs
              </h4>
              <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '16px', lineHeight: '1.8' }}>
                {examScores.map((e, i) => (
                  <li key={i}><strong>{e.exam}:</strong> {e.score} ({e.type})</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18}/> Preferences
              </h4>
              <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '16px', lineHeight: '1.8' }}>
                <li><strong>Branch:</strong> {preferences.branch}</li>
                <li><strong>Goal:</strong> {preferences.careerGoal}</li>
                <li><strong>Budget:</strong> {preferences.budget}</li>
                <li><strong>Location:</strong> {preferences.location}</li>
                <li><strong>Category:</strong> {preferences.category}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Guidance List per College */}
        {guidance.guidanceList.map((data, idx) => (
          <div key={idx} className="glass-card" style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
            <h2 style={{ color: 'var(--tertiary)', fontSize: '36px', marginBottom: '8px' }}>
              {data.collegeName}
            </h2>
            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '32px' }}/>

            {/* Core Stats */}
            <div className="dynamic-split" style={{ marginBottom: '32px' }}>
              <div className="stat-item" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                  <GraduationCap size={18}/> Seats Availability
                </h4>
                <p style={{ marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>{data.seats}</p>
              </div>
              <div className="stat-item" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
                  <DollarSign size={18}/> Fee Structure
                </h4>
                <p style={{ marginTop: '12px', fontSize: '16px', lineHeight: '1.6' }}>{data.fees}</p>
              </div>
            </div>

            {/* Notices */}
            <div className="dynamic-split" style={{ marginBottom: '32px' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}>
                  <Landmark size={18}/> Government Notices
                </h4>
                <ul style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '1.6', color: 'var(--on-surface-muted)' }}>
                  {data.govNotices?.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--tertiary)' }}>
                  <Building size={18}/> College Notices
                </h4>
                <ul style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '1.6', color: 'var(--on-surface-muted)' }}>
                  {data.collegeNotices?.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            </div>

            {/* Required Documents */}
            <h3 className="section-heading" style={{ marginTop: '40px' }}><FileText size={20}/> Required Documents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div className="stat-item" style={{ background: 'rgba(56, 189, 248, 0.05)' }}>
                <h5 style={{ color: 'var(--secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={16}/> National Portals
                </h5>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', color: 'var(--on-surface)' }}>
                  {data.nationalDocuments?.length > 0 ? data.nationalDocuments.map((s, i) => <li key={i}>{s}</li>) : <li style={{ color: 'var(--on-surface-muted)' }}>No specific documents found</li>}
                </ul>
              </div>
              <div className="stat-item" style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                <h5 style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Landmark size={16}/> State Portals
                </h5>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', color: 'var(--on-surface)' }}>
                  {data.stateDocuments?.length > 0 ? data.stateDocuments.map((s, i) => <li key={i}>{s}</li>) : <li style={{ color: 'var(--on-surface-muted)' }}>No specific documents found</li>}
                </ul>
              </div>
              <div className="stat-item" style={{ background: 'rgba(244, 114, 182, 0.05)' }}>
                <h5 style={{ color: 'var(--tertiary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16}/> Physical Admission
                </h5>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', color: 'var(--on-surface)' }}>
                  {data.collegeDocuments?.length > 0 ? data.collegeDocuments.map((s, i) => <li key={i}>{s}</li>) : <li style={{ color: 'var(--on-surface-muted)' }}>No specific documents found</li>}
                </ul>
              </div>
            </div>

            {/* Scholarships */}
            <h3 className="section-heading" style={{ marginTop: '40px' }}><DollarSign size={20}/> Eligible Scholarships</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div className="stat-item">
                <h5 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Government</h5>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                  {data.govScholarships?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="stat-item">
                <h5 style={{ color: 'var(--secondary)', marginBottom: '12px' }}>Private Organizations</h5>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                  {data.privateScholarships?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="stat-item">
                <h5 style={{ color: 'var(--tertiary)', marginBottom: '12px' }}>College Specific</h5>
                <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                  {data.collegeScholarships?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            {/* Mistakes & Portals */}
            <div className="dynamic-split">
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
                  <AlertCircle size={18}/> Mistakes to Avoid
                </h4>
                <ul style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '1.6', color: '#fca5a5' }}>
                  {data.mistakes?.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                  <ExternalLink size={18}/> Official Portals
                </h4>
                <ul style={{ marginTop: '16px', paddingLeft: '20px', lineHeight: '1.6' }}>
                  {data.portals?.map((p, i) => (
                    <li key={i}>
                      <a href={p} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default GuidanceScreen;
