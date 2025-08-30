import { useState } from "react";

import { mockApi } from "../utils/utils";
import React from "react";

function ProcedureMode() {
  const [procedures] = useState([
    { id: 'proc-fryer-1', title: 'Deep Fryer — Draining & Filtering', steps: [
      'Turn off heat; cool to 60–70°C.',
      'Place filter container; open drain slowly.',
      'Filter per manufacturer guide; remove crumbs.',
      'Close valve; refill to MAX.'
    ], docRef: 'Deep Fryer Safety v1.2' }
  ]);
  const [active, setActive] = useState(procedures[0]);
  const [completed, setCompleted] = useState([]);
  const [runId, setRunId] = useState(null);

  const startRun = async () => {
    const r = await mockApi.startProcedure(active.id);
    setRunId(r.runId);
  };

  const toggleStep = (idx) => {
    setCompleted(prev => prev.includes(idx) ? prev.filter(i=>i!==idx) : [...prev, idx]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">{active.title}</h2>
      <p className="text-sm text-muted-foreground">Source: {active.docRef}</p>
      <div className="mt-4 space-y-3">
        {active.steps.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <input type="checkbox" checked={completed.includes(i)} onChange={() => toggleStep(i)} />
            <div className="flex-1">
              <div className="font-medium">Step {i+1}</div>
              <div className="text-sm">{s}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={startRun} className="px-4 py-2 bg-indigo-600 text-white rounded">Start Procedure</button>
        <button className="px-4 py-2 border rounded">Reset</button>
        {runId && <span className="ml-2 text-sm text-gray-500">Run ID: {runId}</span>}
      </div>
    </div>
  );
}

export default ProcedureMode;