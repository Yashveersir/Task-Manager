import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check, Layout, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JoinTeamModal from './JoinTeamModal';

export default function TeamSwitcher() {
  const { user, switchTeam } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeTeam = user?.activeTeam;
  const teams = user?.teams || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (teamId) => {
    if (teamId === activeTeam?._id) return;
    setIsOpen(false);
    await switchTeam(teamId);
  };

  return (
    <div className="relative px-3 mb-6" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/50 hover:bg-dark-800 transition-all group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center border border-accent-blue/20">
            <Layout className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Workspace</p>
            <p className="text-sm font-bold text-dark-50 truncate">{activeTeam?.name || 'Loading...'}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-3 right-3 mt-2 z-50 bg-dark-800 rounded-xl border border-dark-700/50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
            {teams.map((team) => (
              <button
                key={team._id}
                onClick={() => handleSwitch(team._id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors mb-1 ${
                  team._id === activeTeam?._id
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-dark-300 hover:bg-dark-700/50 hover:text-white'
                }`}
              >
                <span className="truncate pr-2">{team.name}</span>
                {team._id === activeTeam?._id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-dark-700/50 space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full flex items-center gap-2 p-3 rounded-lg text-sm text-dark-400 hover:bg-dark-700/50 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Join or Create Team
            </button>
          </div>
        </div>
      )}

      <JoinTeamModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
