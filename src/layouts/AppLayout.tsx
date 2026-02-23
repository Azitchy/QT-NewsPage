import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { MobileBottomBar, MobileTopBar }  from "@/components/Sidebar";
import { useUnified } from "@/context/Context";

function AppLayout() {
  const { isAuthenticated, status, openModal } = useUnified();

  // Keep the blur overlay until the full auth flow completes (wallet
  // connected + JWT signed).  This covers the entire sequence:
  //   disconnected → connecting → reconnecting → connected → signing → authenticated
  const showOverlay = !isAuthenticated;

  // Auto-open the Reown AppKit connect modal — but with a delay so we
  // don't interfere with embedded wallet (Google/social) session hydration.
  //
  // Problem: Reown may briefly emit status='disconnected' while hydrating
  // a persisted Google session before flipping to 'reconnecting' → 'connected'.
  // Calling openModal() during that transient 'disconnected' kills the
  // embedded wallet iframe and breaks Google auth.
  //
  // Solution: When we see 'disconnected', start a timer. If status stays
  // 'disconnected' for the full duration, it's a real disconnect — open
  // the modal. If status changes to anything else before the timer fires,
  // cancel it — Reown is hydrating a session and we must not interfere.
  const autoOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    // Clear any pending timer on every status change
    if (autoOpenTimer.current) {
      clearTimeout(autoOpenTimer.current);
      autoOpenTimer.current = null;
    }

    if (status === 'disconnected' && !hasAutoOpened.current) {
      // Wait 1.5s to confirm this is a real disconnect, not a transient
      // blip during Google session hydration
      autoOpenTimer.current = setTimeout(() => {
        autoOpenTimer.current = null;
        hasAutoOpened.current = true;
        openModal();
      }, 1500);
    } else if (status === 'connected') {
      // Reset so the next disconnect auto-opens again
      hasAutoOpened.current = false;
    }

    return () => {
      if (autoOpenTimer.current) {
        clearTimeout(autoOpenTimer.current);
        autoOpenTimer.current = null;
      }
    };
  }, [status, openModal]);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-[#F6F6F6] overflow-hidden relative">
        <div className="flex flex-1 gap-[20px] overflow-hidden">
          <Sidebar className="my-[30px] ml-[30px] overflow-y-auto"/>
          <main className="flex-1 py-[30px] pr-[30px] overflow-y-auto">
            <Outlet />
          </main>
        </div>
        {showOverlay && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/40 pointer-events-none"
          />
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen bg-[#F6F6F6] relative">
        <MobileTopBar />
        <main className="flex-1 overflow-y-auto px-[16px] pt-[16px] pb-[24px]">
          <Outlet />
        </main>
        <MobileBottomBar />
        {showOverlay && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/40 pointer-events-none"
          >
            <div className="text-center">
              <img src="/atm-logo.png" alt="ATM" className="w-14 h-14 mx-auto mb-3 opacity-80" />
              <p className="text-base font-medium text-gray-600">Connecting...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AppLayout;
