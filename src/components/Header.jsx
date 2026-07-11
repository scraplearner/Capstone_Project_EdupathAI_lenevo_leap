import { GraduationCap } from 'lucide-react';

function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <GraduationCap size={26} />
        </div>
        <div>
          <div className="header-title">EduPathAI</div>
          <div className="header-subtitle">AI_COLLEGE_NAVIGATOR · v2.0</div>
        </div>
      </div>

      <div className="header-right">
        <div className="sdg-badges">
          <span className="sdg-badge sdg-badge-4">SDG 4 ◉</span>
          <span className="sdg-badge sdg-badge-10">SDG 10 ◉</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
