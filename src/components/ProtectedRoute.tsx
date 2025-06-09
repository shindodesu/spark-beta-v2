// components/ProtectedRoute.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../lib/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 認証されていない場合、ログインページへリダイレクト
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>Loading...</p>; // またはローディングスピナー
  }

  return <>{children}</>;
};

export default ProtectedRoute;