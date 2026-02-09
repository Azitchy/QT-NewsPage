import { Outlet } from "react-router-dom";
import { DashboardCacheProvider } from "@/context/DashboardCacheContext";

/**
 * Wraps dashboard child routes with a cache provider so data persists
 * when switching between Portfolio and Income tabs without re-fetching.
 */
export default function DashboardLayout() {
  return (
    <DashboardCacheProvider>
      <Outlet />
    </DashboardCacheProvider>
  );
}
