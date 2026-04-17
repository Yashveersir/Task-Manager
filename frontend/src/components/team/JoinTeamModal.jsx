import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Zap, Plus, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function JoinTeamModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'
  const [inviteCode, setInviteCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinTeam, createTeam } = useAuth();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setLoading(true);
    try {
      await joinTeam(inviteCode);
      toast.success('Joined workspace successfully!');
      onClose();
      setInviteCode('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setLoading(true);
    try {
      await createTeam(teamName);
      toast.success('Workspace created successfully!');
      onClose();
      setTeamName('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={activeTab === 'join' ? "Join Workspace" : "Create New Workspace"} 
      size="sm"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex bg-dark-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'join' 
                ? 'bg-dark-700 text-white shadow-sm' 
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Join
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'create' 
                ? 'bg-dark-700 text-white shadow-sm' 
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Create
          </button>
        </div>

        {activeTab === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <p className="text-sm text-dark-400">
              Enter the unique invitation code provided by your team lead.
            </p>
            <Input
              label="Invitation Code"
              placeholder="e.g. LEGACY123"
              icon={Zap}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Join Workspace
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <p className="text-sm text-dark-400">
              Give your new workspace a name. You can invite your team later.
            </p>
            <Input
              label="Workspace Name"
              placeholder="e.g. Marketing Team"
              icon={Plus}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} className="w-full" variant="secondary">
              Create Workspace
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
