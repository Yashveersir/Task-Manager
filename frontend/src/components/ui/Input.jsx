import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark-200">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        )}
        <input
          ref={ref}
          className={`
            w-full bg-dark-800/50 border border-dark-600/50 rounded-xl
            px-4 py-3 text-sm text-dark-100 placeholder-dark-500
            focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-accent-rose/50 focus:border-accent-rose/50 focus:ring-accent-rose/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-accent-rose mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
