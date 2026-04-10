import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/problembox/AdminDashboard';

export default function ProblemBoxAdminPage() {

  return (
    <AdminLayout 
      title="Triage Center" 
      subtitle="Live Operations & Issue Resolution" 
    >
      <AdminDashboard />
    </AdminLayout>
  );
}
