import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminLoginForm from '../../components/AdminLoginForm';
import { isValidSession } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function SecretAdminRoute({
  params,
}: {
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;
  const secretPath = process.env.ADMIN_SECRET_PATH || 'gatekeeper';

  // Return 404 for any path that isn't the secret path
  if (adminPath !== secretPath) {
    notFound();
  }

  // Check if session is already valid; if so, send directly to dashboard
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (token && isValidSession(token)) {
    redirect('/admin-panel');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminLoginForm />
    </div>
  );
}
