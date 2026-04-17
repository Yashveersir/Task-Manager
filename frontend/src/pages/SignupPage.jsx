import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { signup } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCode = searchParams.get('code') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name || name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(name, email, password, inviteCode);
      toast.success('Account created successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple mb-4 shadow-lg shadow-accent-blue/20">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-dark-400">Join TaskFlow and start collaborating</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              id="signup-name"
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              id="signup-email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              id="signup-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              id="signup-confirm-password"
            />

            <Input
              label="Invitation Code (Optional)"
              type="text"
              placeholder="Leave blank to create a new team"
              icon={Zap}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              id="signup-invite-code"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
              id="signup-submit"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-dark-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent-blue hover:text-accent-purple transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
