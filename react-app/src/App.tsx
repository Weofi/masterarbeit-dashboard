import { Routes, Route, Navigate } from "react-router";
import './App.css'
import Dashboard from "./dashboard/dashboard.tsx";
import Header from "./header/header.tsx";

function App() {

  return (
    <>
      <Header></Header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/1k" />} />
          <Route path="/1k" element={<><Dashboard key="1k" dataSet={1_000} /></>} />
          <Route path="/10k" element={<><Dashboard key="10k" dataSet={10_000} /></>} />
          <Route path="/100k" element={<><Dashboard key="100k" dataSet={100_000} /></>} />
          <Route path="/1M" element={<><Dashboard key="1M" dataSet={1_000_000} /></>} />
        </Routes>

      </main>
    </>
  )
}

export default App
