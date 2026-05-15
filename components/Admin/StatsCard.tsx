interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colors = { blue: "bg-blue-50 text-blue-600", green: "bg-green-50 text-green-600", purple: "bg-purple-50 text-purple-600", orange: "bg-orange-50 text-orange-600" };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
