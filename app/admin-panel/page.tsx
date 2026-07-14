import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { isValidSession, getPortfolio, getShop } from '../../lib/db';
import AdminDashboard from '../../components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPanelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  // Protect the dashboard: return 404 if not authenticated to mask the route's existence
  if (!token || !isValidSession(token)) {
    notFound();
  }

  // Fetch initial data securely on the server
  const portfolio = getPortfolio();
  const shop = getShop();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <AdminDashboard initialPortfolio={portfolio} initialShop={shop} />
    </div>
  );
}
