import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@layouts/MainLayout';
import { SplashScreen } from '@pages/SplashScreen';
import { Login } from '@pages/Login';
import { Register } from '@pages/Register';
import { Home } from '@pages/Home';
import { Marketplace } from '@pages/Marketplace';
import { Inventory } from '@pages/Inventory';
import { Orders } from '@pages/Orders';
import { Profile } from '@pages/Profile';
import { Settings } from '@pages/Settings';
import { Chat } from '@pages/Chat';
import { WorldLoading } from '@pages/WorldLoading';
import World2D from '@pages/World2D';
import InnerBuildingScene from '@/world_one/inner_building_scene';
import { ProtectedRoute } from '@components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/home" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/world/loading" element={<WorldLoading />} />
      </Route>
      <Route path="/world" element={<ProtectedRoute><World2D /></ProtectedRoute>} />
      <Route path="/inner-building/:sceneName" element={<ProtectedRoute><InnerBuildingScene /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
