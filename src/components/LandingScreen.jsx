import { ArrowRight, Sparkles, Target, Compass, BookOpen } from 'lucide-react';

function LandingScreen({ onGetStarted }) {
  return (
    <div className="screen-wrapper dynamic-split">
      <div style={{ paddingRight: '20px' }}>
        <h1 className="screen-title" style={{ animationDelay: '0.1s' }}>
          Your AI <span>Career Navigator</span>
        </h1>
        <p className="screen-description" style={{ animationDelay: '0.2s' }}>
          Discover your perfect college fit with hyper-personalized AI guidance. 
          Get actionable roadmaps, matched scholarships, and 24/7 counseling.
        </p>
        <div style={{ animationDelay: '0.3s', animation: 'pageIn 0.6s both' }}>
          <button className="btn btn-primary" onClick={onGetStarted}>
            <Sparkles size={20} />
            Start Journey
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', animationDelay: '0.4s' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Smart Matching</h3>
            <p style={{ color: 'var(--on-surface-muted)', fontSize: '14px' }}>Analyzes 15+ parameters for perfect fit.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Clear Roadmaps</h3>
            <p style={{ color: 'var(--on-surface-muted)', fontSize: '14px' }}>Step-by-step guidance & deadlines.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--tertiary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Scholarship Finder</h3>
            <p style={{ color: 'var(--on-surface-muted)', fontSize: '14px' }}>Discover matched financial aid.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingScreen;
