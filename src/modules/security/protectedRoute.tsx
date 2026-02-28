import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/authStore';
import Loader from '../loader/loader';
import { runInAction } from 'mobx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyAndLoad = async () => {
      try {
        runInAction(() => {
          authStore.isLoading = true;
          authStore.error = null;
        });

        const hasSession = await authStore.checkRoleSession();

        if (!isMounted) return;

        if (!hasSession) {
          router.replace('/unauthtorized');
          return;
        }

        if (allowedRoles.length > 0) {
          const userRole = authStore.user?.role?.toLowerCase() ?? '';
          const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());

          const hasRoleAccess = allowedRolesLower.some(
            allowed => userRole.includes(allowed) || allowed.includes(userRole)
          );

          if (!hasRoleAccess) {
            router.replace('/unauthtorized');
            return;
          }
        }
      } catch (err) {
        console.error('Ошибка проверки сессии:', err);
        router.replace('/unauthtorized');
      } finally {
        if (isMounted) setIsVerifying(false);

        runInAction(() => {
          authStore.isLoading = false;
        });
      }
    };

    verifyAndLoad();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles, router]);

  if (isVerifying) {
    return <Loader spinType={true} flag={isVerifying} />;
  }

  return <>{children}</>;
}

export default observer(ProtectedRoute);