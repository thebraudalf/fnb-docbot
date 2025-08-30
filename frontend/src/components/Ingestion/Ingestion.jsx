import { useState } from "react";
import { mockApi } from "../../utils/utils";


function Ingestion() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
  
    const onUpload = async () => {
      if (!file) return;
      setStatus('uploading');
      try {
        const res = await mockApi.ingestDoc(file);
        setStatus(`Uploaded: ${res.docId} • ${res.title}`);
      } catch (err) { setStatus('error'); }
    };
  
    return (
      <div>
        <h2 className="text-xl font-semibold">Ingest SOP / Policies</h2>
        <p className="text-sm text-gray-600">Accepts PDF / DOCX / Markdown / Images (OCR)</p>
        <div className="mt-4">
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <div className="mt-3">
            <button onClick={onUpload} className="px-4 py-2 bg-indigo-600 text-white rounded">Upload & Index</button>
          </div>
          {status && <div className="mt-3 text-sm text-gray-700">{status}</div>}
        </div>
  
      </div>
    );
  }
  
  export default Ingestion;