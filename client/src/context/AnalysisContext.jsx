/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AnalysisContext = createContext();
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
};

export const AnalysisProvider = ({ children }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [linkedinData, setLinkedinData] = useState(null);

  const runAnalysis = useCallback(async (file, jobDescription) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    try {
      const res = await axios.post(`${API}/analysis/start`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      if (res.data.points) setPoints(res.data.points);
      return res.data;
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Analysis failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const downloadExcel = useCallback(async (analysisId) => {
    const resp = await axios.get(`${API}/analysis/${analysisId}/export`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Elite_Resume_Report.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }, []);

  const getCoverLetter = useCallback(async (analysisId) => {
    const res = await axios.get(`${API}/analysis/${analysisId}/cover-letter`);
    return res.data.coverLetter;
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/analysis/history/versions`);
      setHistory(res.data.history || []);
    } catch { setHistory([]); }
  }, []);

  const fetchPoints = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/analysis/user/points`);
      setPoints(res.data.points || 0);
      return res.data;
    } catch { return { points: 0, tier: 'Bronze' }; }
  }, []);

  const syncLinkedIn = useCallback(async () => {
    const res = await axios.get(`${API}/analysis/linkedin/sync`);
    setLinkedinData(res.data.linkedinData);
    return res.data;
  }, []);

  const applyLivePatch = useCallback(async (analysisId, repairText) => {
    try {
      const res = await axios.post(`${API}/analysis/${analysisId}/rescore`, { repairText });
      if (res.data.success) {
        setResult(res.data);
        if (res.data.points) setPoints(res.data.points);
      }
      return res.data;
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Patch failed';
      throw new Error(msg);
    }
  }, []);

  return (
    <AnalysisContext.Provider value={{
      analyzing, result, error, points, history, linkedinData,
      runAnalysis, downloadExcel, getCoverLetter, fetchHistory, fetchPoints, syncLinkedIn, applyLivePatch,
      setResult
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};
