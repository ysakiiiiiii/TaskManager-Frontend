import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
  userRole: string | null;
  redirectPath?: string; 
}

const ProtectedRoute = ({
  allowedRoles,
  userRole,
  redirectPath = '/forbidden',
}: ProtectedRouteProps) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
