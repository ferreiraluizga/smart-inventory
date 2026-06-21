import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
      <BrowserRouter>
        <AppRoutes></AppRoutes>
      </BrowserRouter>
  );
}