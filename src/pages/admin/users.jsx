import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Search, 
  UserX, 
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_USERS = [
  { id: 'usr-001', name: 'Rohan Sharma', email: 'rohan.s@campus.edu', role: 'STUDENT', joined: '12 Aug 2024', status: 'Active' },
  { id: 'usr-002', name: 'Priya Patel', email: 'priya.p@campus.edu', role: 'ADMIN', joined: '01 Sep 2023', status: 'Active' },
  { id: 'usr-003', name: 'Raju Canteen', email: 'maincafe@campus.edu', role: 'VENDOR', joined: '15 Jan 2024', status: 'Active' },
  { id: 'usr-004', name: 'Amit Kumar', email: 'amit.k@campus.edu', role: 'STUDENT', joined: '10 Feb 2025', status: 'Suspended' },
  { id: 'usr-005', name: 'Dr. S. Menon', email: 's.menon@campus.edu', role: 'ADMIN', joined: '05 Mar 2022', status: 'Active' },
  { id: 'usr-006', name: 'Kabir Das', email: 'kabir.d@campus.edu', role: 'STUDENT', joined: '18 Aug 2024', status: 'Active' },
  { id: 'usr-007', name: 'Ananya Singh', email: 'ananya.s@campus.edu', role: 'STUDENT', joined: '22 Aug 2024', status: 'Active' },
  { id: 'usr-008', name: 'Library Cafe', email: 'libcafe@campus.edu', role: 'VENDOR', joined: '04 Apr 2023', status: 'Active' },
  { id: 'usr-009', name: 'Vikram Mehta', email: 'v.mehta@campus.edu', role: 'ADMIN', joined: '11 Nov 2021', status: 'Active' },
  { id: 'usr-010', name: 'Neha Gupta', email: 'neha.g@campus.edu', role: 'STUDENT', joined: '05 Sep 2024', status: 'Active' },
  { id: 'usr-011', name: 'Kushal Jain', email: 'kushal.j@campus.edu', role: 'STUDENT', joined: '12 Aug 2024', status: 'Active' },
  { id: 'usr-012', name: 'Stationery Hub', email: 'store@campus.edu', role: 'VENDOR', joined: '20 Jul 2022', status: 'Active' },
  { id: 'usr-013', name: 'Prof. R. Iyer', email: 'r.iyer@campus.edu', role: 'ADMIN', joined: '14 Jan 2020', status: 'Active' },
  { id: 'usr-014', name: 'Siddharth Rao', email: 'siddharth.r@campus.edu', role: 'STUDENT', joined: '30 Aug 2024', status: 'Suspended' },
  { id: 'usr-015', name: 'Meera Reddy', email: 'meera.r@campus.edu', role: 'STUDENT', joined: '02 Sep 2024', status: 'Active' },
];

const LOCATIONS = [
  'Main Auditorium', 'Engineering Block (A)', 'Engineering Block (B)', 'Food Court', 'Main Cafe', 'Library'
];

export default function UsersAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [locInput, setLocInput] = useState('');
  const [locations, setLocations] = useState(LOCATIONS);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const addLocation = () => {
    const trimmed = locInput.trim();
    if(trimmed && !locations.includes(trimmed)) {
      setLocations(prev => [...prev, trimmed]);
      setLocInput('');
    }
  };

  return (
    <AdminLayout 
      title="Global Access" 
      subtitle="Identity & Role Management"
    >
      <div className="space-y-10 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* USERS TABLE (2/3) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-xl dark:shadow-2xl rounded-[45px] p-8 space-y-6">
             <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Registry</h3>
               <div className="relative w-64 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 focus:border-blue-500 rounded-full py-2.5 pl-10 pr-4 text-sm font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all text-slate-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
             </div>

             <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5">
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-100 dark:bg-white/5">User</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-100 dark:bg-white/5">Role</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-100 dark:bg-white/5">Joined</th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-100 dark:bg-white/5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-slate-900 dark:text-white shadow-sm dark:shadow-none">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{user.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border appearance-none outline-none cursor-pointer transition-colors ${
                              user.role === 'ADMIN' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-100 dark:border-red-500/20' :
                              user.role === 'VENDOR' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-500/20' :
                              'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                            }`}
                          >
                            <option value="STUDENT">Student</option>
                            <option value="VENDOR">Vendor</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{user.joined}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                            <UserX size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* LOCATIONS CONFIG (1/3) */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-slate-100 dark:border-white/5 shadow-xl dark:shadow-2xl rounded-[45px] p-8 flex flex-col">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Locations</h3>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Global Master List</p>
                </div>
             </div>

             <div className="flex gap-2 mb-6">
               <input 
                 type="text"
                 placeholder="New Building / Lab..."
                 className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                 value={locInput}
                 onChange={(e) => setLocInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addLocation()}
               />
               <button onClick={addLocation} className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                 Add
               </button>
             </div>

             <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
               {locations.map((loc, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   key={i} 
                   className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-colors"
                 >
                   <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{loc}</span>
                   <button onClick={() => setLocations(locations.filter(l => l !== loc))} className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                     <UserX size={14} />
                   </button>
                 </motion.div>
               ))}
             </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
