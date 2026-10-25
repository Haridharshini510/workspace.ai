import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        // Redirect to login with error
        navigate(`/login?error=${error}`);
        return;
      }

      if (token) {
        try {
          // Login with token (stores in localStorage and fetches user)
          await login(token);
          // Redirect to app
          navigate('/app');
        } catch (err) {
          console.error('Login failed:', err);
          navigate('/login?error=auth_failed');
        }
      } else {
        // No token, redirect to login
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
