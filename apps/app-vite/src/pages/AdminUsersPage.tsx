import { OutlinedCard } from '../components/ui';

const users = [
  { name: 'Nadia', status: 'Active', plan: 'Calm Plus' },
  { name: 'Raka', status: 'Active', plan: 'Calm Start' },
  { name: 'Sinta', status: 'Paused', plan: 'Calm Plus' }
];

export function AdminUsersPage() {
  return (
    <OutlinedCard className="space-y-4">
      <h1 className="text-h4 font-extrabold">User Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-caption">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2">Nama</th>
              <th className="py-2">Status</th>
              <th className="py-2">Plan</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name} className="border-b border-border/50">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.status}</td>
                <td className="py-2">{user.plan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OutlinedCard>
  );
}
