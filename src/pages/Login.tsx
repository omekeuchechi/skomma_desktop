import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@components/Button';
import { login } from '@services/api';
import { useAuthStore, AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY } from '@stores/authStore';
import { toApiError } from '@network/http';
import { ROUTES } from '@constants/index';
import { useBackgroundCarousel } from '@hooks/useBackgroundCarousel';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [formError, setFormError] = useState<string | null>(null);
  const { images, currentIndex } = useBackgroundCarousel(3000);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      // Use email as username for API compatibility
      const tokens = await login({ email: values.email, password: values.password });
      localStorage.setItem(AUTH_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, tokens.refreshToken);
      setTokens(tokens);
      navigate(ROUTES.home);
    } catch (error) {
      setFormError(toApiError(error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-image ${index === currentIndex ? 'active' : 'inactive'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-8 ml-8">
        <div className="bg-surface-900/90 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-surface-700 animate-fade-in-slide-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Skomma</h1>
            <p className="text-surface-400 text-sm">Authorization</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-surface-800 border border-surface-600 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                {...register('email')}
              />
              {errors.email && <p className="text-danger-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-surface-800 border border-surface-600 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                {...register('password')}
              />
              {errors.password && <p className="text-danger-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {formError && <p className="text-danger-500 text-sm text-center">{formError}</p>}

            <Button
              type="submit"
              loading={isSubmitting}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Login to Skomma
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-900 text-surface-400">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Login with Discord
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-400">
            Don't have an account?{' '}
            <Link to={ROUTES.register} className="text-primary-400 hover:text-primary-300 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
