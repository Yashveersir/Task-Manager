import { useState, useEffect } from 'react';
import api from '../api/axios';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { Users, Mail, Shield, Clock } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import Button from '../components/ui/Button';
import { UserPlus } from 'lucide-react';
import InviteModal from '../components/team/InviteModal';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { user } = useAuth();
  const inviteCode = user?.team?.inviteCode || 'N/A';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data.data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark-50">Team Members</h1>
          <p className="text-dark-400 mt-1">Manage your team and assign tasks</p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="glass-card p-4 inline-flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-dark-50">{users.length}</p>
          <p className="text-xs text-dark-400">Total Members</p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((member) => (
          <div
            key={member._id}
            className="glass-card p-6 hover:shadow-xl hover:shadow-accent-blue/5 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={member.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-dark-100 truncate">
                  {member.name}
                </h3>
                <Badge variant={member.role} className="mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  {member.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-dark-700/30">
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Mail className="w-4 h-4 text-dark-500" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Clock className="w-4 h-4 text-dark-500" />
                <span>Joined {formatDate(member.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-dark-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-400">No team members yet</h3>
          <p className="text-sm text-dark-600 mt-1">
            Invite your team to start collaborating
          </p>
        </div>
      )}

      {/* Invite Modal */}
      <InviteModal 
        isOpen={inviteModalOpen} 
        onClose={() => setInviteModalOpen(false)} 
        inviteCode={inviteCode} 
      />
    </div>
  );
}
