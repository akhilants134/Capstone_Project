/* ===== Dashboard Page — role-aware router ===== */
import DonorDashboard from './dashboards/DonorDashboard';
import RecipientDashboard from './dashboards/RecipientDashboard';
import CommunityDashboard from './dashboards/CommunityDashboard';

export default function DashboardPage({ navigate, user }) {
  switch (user?.role) {
    case 'donor':
      return <DonorDashboard navigate={navigate} user={user} />;
    case 'recipient':
      return <RecipientDashboard navigate={navigate} user={user} />;
    case 'community':
    default:
      return <CommunityDashboard navigate={navigate} user={user} />;
  }
}
