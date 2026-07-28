import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSessionUser, getPortfolio, getShop, getUsers } from '../../lib/db';
import AdminDashboard from '../../components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPanelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    notFound();
  }

  const currentUser = getSessionUser(token);
  if (!currentUser) {
    notFound();
  }

  // Fetch initial data securely on the server
  const portfolio = getPortfolio();
  const shop = getShop();
  const users = currentUser.role === 'super_admin' || currentUser.permissions.includes('manage_users') 
    ? getUsers() 
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AdminDashboard 
        currentUser={currentUser} 
        initialPortfolio={portfolio} 
        initialShop={shop} 
        initialUsers={users}
      />
    </div>
  );
}
