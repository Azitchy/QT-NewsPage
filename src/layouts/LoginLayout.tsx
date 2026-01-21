import { Outlet } from "react-router-dom";

function LoginLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Outlet /> {/* Connect page */}
      </div>
    </div>
  );
};

export default LoginLayout;
