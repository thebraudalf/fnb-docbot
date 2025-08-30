import { useState } from "react";
import { mockApi } from "../../utils/utils";

function QuizModule() {
  const seed = [
    { id: 1, q: 'Which extinguisher class is used for oil fires?', options: ['Class A', 'Class B', 'Class K', 'Class C'], answer: 2 },
    { id: 2, q: 'Temperature to cool fryer before draining?', options: ['30-40°C', '60-70°C', '90-100°C'], answer: 1 }
  ];
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [missed, setMissed] = useState([]);

  const submit = () => {
    const cur = seed[index];
    if (selected === null) return;
    if (selected === cur.answer) setScore(s => s+1); else setMissed(m=>[...m,cur]);
    setSelected(null);
    setIndex(i => Math.min(seed.length-1, i+1));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Microlearning Quiz</h2>
      <div className="mt-4 bg-gray-50 p-4 rounded">
        <div className="font-medium">Q{index+1}: {seed[index].q}</div>
        <div className="mt-3 space-y-2">
          {seed[index].options.map((o, i) => (
            <label key={i} className={`block p-2 border rounded ${selected===i? 'bg-indigo-100':''}`}>
              <input type="radio" name="opt" checked={selected===i} onChange={()=>setSelected(i)} /> <span className="ml-2">{o}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
        </div>
        <div className="mt-4 text-sm text-gray-600">Score: {score} • Missed: {missed.length}</div>
      </div>
    </div>
  );
}

export default QuizModule;
