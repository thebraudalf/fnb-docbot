export const mockApi = {
    // Simulate ingestion
    ingestDoc: async (file) => {
      await sleep(600);
      return { ok: true, docId: 'DOC-' + Math.floor(Math.random() * 1000), title: file.name || 'Uploaded SOP' };
    },
    // Simulate docbot query (RAG)
    queryDocbot: async (q) => {
      await sleep(700);
      // return mocked RAG answer + citations
      return {
        answer: `Mocked answer for: ${q.slice(0, 80)}`,
        citations: [{ doc: 'Deep Fryer Safety v1.2', section: 'Draining & Filtering', anchor: 'sec-3', text: 'Turn off heat; cool to 60–70°C.' }],
      };
    },
    // Mock create procedure run
    startProcedure: async (procedureId) => {
      await sleep(400);
      return { runId: 'RUN-' + Math.floor(Math.random() * 10000) };
    },
    fetchManagerStats: async () => {
      await sleep(300);
      return { completionPct: 82, avgScore: 86, lastTrained: '2025-08-25' };
    }
  };

export  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  