import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router";
import './App.css'
import Dashboard from "./dashboard/dashboard.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/1k" />} />
          <Route path="/1k" element={<Dashboard dataSet={1_000} />} />
          <Route path="/10k" element={<Dashboard dataSet={10_000} />} />
          <Route path="/100k" element={<Dashboard dataSet={100_000} />} />
          <Route path="/1m" element={<Dashboard dataSet={1_000_000} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
