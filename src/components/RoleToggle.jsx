import { useApp } from '../App';
import './RoleToggle.css';

function RoleToggle() {
  const { role, setRole } = useApp();

  return (
    <div className="role-toggle" id="role-toggle">
      <button
        className={`role-toggle__btn ${role === 'mama' ? 'role-toggle__btn--active role-toggle__btn--mama' : ''}`}
        onClick={() => setRole('mama')}
        aria-pressed={role === 'mama'}
      >
        <span className="role-toggle__emoji">👩</span>
        <span>Mama</span>
      </button>
      <button
        className={`role-toggle__btn ${role === 'papa' ? 'role-toggle__btn--active role-toggle__btn--papa' : ''}`}
        onClick={() => setRole('papa')}
        aria-pressed={role === 'papa'}
      >
        <span className="role-toggle__emoji">👨</span>
        <span>Papa</span>
      </button>
    </div>
  );
}

export default RoleToggle;
