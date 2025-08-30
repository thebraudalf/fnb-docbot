import { useState } from "react";
import { mockApi } from "../utils/utils";
import { useEffect } from "react";
function ManagerDashboard() {
    const [stats, setStats] = useState(null);
    useEffect(()=>{ mockApi.fetchManagerStats().then(setStats); }, []);
  
    return (
      <div>
        <h2 className="text-xl font-semibold">Manager Dashboard</h2>
        {!stats && <div className="mt-4">Loading metrics...</div>}
        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 rounded">
              <div className="text-sm">Completion %</div>
              <div className="text-3xl font-bold">{stats.completionPct}%</div>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <div className="text-sm">Average Quiz Score</div>
              <div className="text-3xl font-bold">{stats.avgScore}%</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm">Last Trained</div>
              <div className="text-2xl">{stats.lastTrained}</div>
            </div>
          </div>
        )}
  
        <div className="mt-6">
          <h3 className="font-medium">Recent Exceptions</h3>
          <div className="mt-2 text-sm text-gray-600">No exceptions in demo mode.</div>
        </div>
      </div>
    );
  }

  export default ManagerDashboard;
  