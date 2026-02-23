import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { DashboardCacheProvider, useDashboardCache } from "@/context/DashboardCacheContext";
import { useUnified } from "@/context/Context";

/**
 * Inner wrapper so we can access both the cache context and auth state.
 * Clears all cached dashboard data whenever the user logs out.
 */
function DashboardCacheWatcher() {
  const { isAuthenticated } = useUnified();
  const { clearAllCache } = useDashboardCache();
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) {
      clearAllCache();
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, clearAllCache]);

  return <Outlet />;
}

/**
 * Wraps dashboard child routes with a cache provider so data persists
 * when switching between Portfolio and Income tabs without re-fetching.
 * Cache is cleared automatically on logout.
 */
export default function DashboardLayout() {
  return (
    <DashboardCacheProvider>
      <DashboardCacheWatcher />
    </DashboardCacheProvider>
  );
}
