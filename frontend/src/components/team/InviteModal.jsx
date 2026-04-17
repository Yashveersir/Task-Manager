import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Copy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InviteModal({ isOpen, onClose, inviteCode }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fallback to origin if we somehow can't determine it
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const inviteLink = `${baseUrl}/signup?code=${inviteCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      toast.success('Invite link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      toast.success('Invite code copied!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite to Workspace" size="sm">
      <div className="space-y-6">
        <p className="text-sm text-dark-400">
          Share this code or link with your colleagues. Only people with this code can join your team workspace.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-dark-400 mb-1">
              Direct Invite Link
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inviteLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button type="button" variant="secondary" onClick={handleCopyLink} className="w-12 px-0 shrink-0">
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-400 mb-1">
              Workspace Code
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inviteCode}
                readOnly
                className="font-mono font-bold tracking-wider text-accent-blue"
              />
              <Button type="button" variant="secondary" onClick={handleCopyCode} className="w-12 px-0 shrink-0">
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
