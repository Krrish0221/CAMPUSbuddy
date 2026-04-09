import { useState, useMemo } from 'react';
import ModuleLayout from '@/components/ModuleLayout';
import { 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  LayoutGrid
} from 'lucide-react';
import { DASHBOARD_STATS, CANTEENS } from '@/data/caffinityData';
import { useCaffinity } from '@/context/CaffinityContext';

export default function CaffinityVendorDashboard() {
  const { 
    orders, 
    updateOrderStatus, 
    selectedCanteen, 
    selectCanteen, 
    resetCanteen,
    isCanteenSelecting
  } = useCaffinity();

  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  // Filter orders by selected canteen
  const canteenOrders = useMemo(() => {
    return orders.filter(o => o.canteenId === selectedCanteen?.id);
  }, [orders, selectedCanteen]);

  const getOrdersByStatus = (status) => canteenOrders.filter(o => o.status === status);

  // 1. CANTEEN SELECTION FOR VENDOR
  if (isCanteenSelecting) {
    return (
      <ModuleLayout title="Vendor Dashboard" subtitle="Select your canteen" color="#1A56DB">
        <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900 font-syne tracking-tighter uppercase italic">Manage Canteen</h2>
            <p className="text-gray-500 font-medium">Which canteen are you managing today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CANTEENS.map(canteen => (
              <div 
                key={canteen.id}
                onClick={() => selectCanteen(canteen)}
                className="group relative h-48 rounded-[40px] overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-600"
              >
                <img 
                  src={canteen.image} 
                  className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                  alt={canteen.name}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent flex items-center p-10">
                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-white tracking-tight uppercase italic">{canteen.name}</h3>
                    <p className="text-gray-300 font-bold uppercase tracking-widest text-xs mt-1">{canteen.location}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:bg-blue-600 transition-colors">
                    <LayoutGrid size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModuleLayout>
    );
  }

  // 2. VENDOR DASHBOARD
  return (
    <ModuleLayout 
      title={`Dashboard: ${selectedCanteen?.name}`} 
      subtitle={`Operational Hub · ${selectedCanteen?.location}`} 
      color="#1A56DB"
    >
      <div className="space-y-8 pb-20">
        <div className="flex items-center justify-between">
           <button 
             onClick={resetCanteen}
             className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.2em]"
           >
             <RotateCcw size={16} /> Switch Management
           </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<DollarSign size={20} />} label="Daily Revenue" value={`₹${DASHBOARD_STATS.dailyRevenue.toLocaleString()}`} trend="+12%" color="blue" />
          <StatCard icon={<ShoppingBag size={20} />} label="Today's Orders" value={canteenOrders.length} trend="Live" color="purple" />
          <StatCard icon={<Users size={20} />} label="Active Queue" value={`${DASHBOARD_STATS.currentQueue}/${DASHBOARD_STATS.activeQueueLimit}`} alert={DASHBOARD_STATS.currentQueue > 20} color="orange" />
          <StatCard icon={<AlertTriangle size={20} />} label="Cancelled" value={DASHBOARD_STATS.cancelledOrders} color="red" />
        </div>

        {/* CONTROLS */}
        <div className={`p-6 rounded-[35px] flex items-center justify-between border-4 transition-all ${
          isAcceptingOrders ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${isAcceptingOrders ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <div>
              <p className="font-black text-gray-900 uppercase tracking-tight text-xl">
                {isAcceptingOrders ? 'Canteen Online' : 'Store Offline'}
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Visibility on student app</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
            className={`px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all ${
              isAcceptingOrders ? 'bg-white text-red-600 hover:bg-red-50' : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isAcceptingOrders ? 'Enter Offline Mode' : 'Go Online Now'}
          </button>
        </div>

        {/* KANBAN BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <KanbanColumn 
            title="New Orders" 
            count={getOrdersByStatus('Placed').length} 
            orders={getOrdersByStatus('Placed')} 
            onAction={(id) => updateOrderStatus(id, 'Preparing')} 
            btnText="Start Cooking" 
            color="blue"
          />
          <KanbanColumn 
            title="Preparing" 
            count={getOrdersByStatus('Preparing').length} 
            orders={getOrdersByStatus('Preparing')} 
            onAction={(id) => updateOrderStatus(id, 'Ready')} 
            btnText="Mark Ready" 
            color="orange"
          />
          <KanbanColumn 
            title="Ready for Pickup" 
            count={getOrdersByStatus('Ready').length} 
            orders={getOrdersByStatus('Ready')} 
            onAction={(id) => updateOrderStatus(id, 'Completed')} 
            btnText="Complete Order" 
            color="green"
          />
        </div>

        {/* INSIGHTS */}
        <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm space-y-8">
           <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <TrendingUp className="text-blue-600" /> Peak Hour Insights (Simulated)
           </h3>
           <div className="flex items-end justify-between h-40 gap-4">
             {DASHBOARD_STATS.peakHourData.map(d => (
               <div key={d.hour} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="relative w-full flex justify-center h-full items-end">
                    <div 
                      className="w-full max-w-[50px] bg-blue-50 group-hover:bg-blue-600 rounded-t-2xl transition-all duration-700 cursor-help"
                      style={{ height: `${(d.count / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.hour}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </ModuleLayout>
  );
}

function StatCard({ icon, label, value, trend, alert, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };
  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4 hover:-translate-y-2 transition-transform duration-500">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-2xl ${colors[color]}`}>
          {icon}
        </div>
        {trend && <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full">{trend}</span>}
        {alert && <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />}
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter mt-1 uppercase italic">{value}</h3>
      </div>
    </div>
  );
}

function KanbanColumn({ title, count, orders, onAction, btnText, color }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-xs">
          {title} <span className="text-blue-600 ml-2 font-syne">{count}</span>
        </h4>
      </div>
      <div className="space-y-4 min-h-[500px] bg-gray-50/50 p-4 rounded-[45px] border-2 border-dashed border-gray-100">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onAction={onAction} btnText={btnText} color={color} />
        ))}
        {orders.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-20 text-gray-200">
            <CheckCircle2 size={48} strokeWidth={1} className="mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">Nothing here</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onAction, btnText, color }) {
  const isPriority = order.scheduledTime && order.scheduledTime !== 'As Soon As Possible';
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-4 hover:shadow-2xl transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-300 tracking-widest uppercase">#{order.id}</span>
        {isPriority && (
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-xl animate-pulse">
            <Clock size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">{order.scheduledTime}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h5 className="font-black text-lg text-gray-900 uppercase tracking-tight italic">{order.studentName}</h5>
        <div className="space-y-1">
          {order.items.map((item, i) => (
            <p key={i} className="text-xs text-gray-500 font-bold flex items-center justify-between">
              <span>{item.name}</span>
              <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded-lg ml-2">x{item.quantity}</span>
            </p>
          ))}
        </div>
      </div>

      {order.specialNote && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 italic">Note:</p>
            <p className="text-xs text-red-800 font-medium italic">&quot;{order.specialNote}&quot;</p>
          </div>
      )}

      <button 
        onClick={() => onAction(order.id)}
        className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
          color === 'blue' ? 'bg-blue-600 text-white hover:bg-gray-900' :
          color === 'orange' ? 'bg-orange-500 text-white hover:bg-gray-900' :
          'bg-green-600 text-white hover:bg-gray-900'
        }`}
      >
        {btnText} <ChevronRight size={14} />
      </button>
    </div>
  );
}
