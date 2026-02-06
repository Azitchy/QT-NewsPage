import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

export default function Page({
  title,
  children,
  showOutlet = false,
}: {
  title: string;
  children?: ReactNode;
  showOutlet?: boolean;
}) {
  return (
    <div className="rounded-[15px] bg-white p-[20px]">
      <h1 className="text-[20px] font-semibold">{title}</h1>
      {children ? <div className="mt-[12px]">{children}</div> : null}
      <div className="mt-[12px]">
        {showOutlet ? <Outlet /> : null}
      </div>
    </div>
  );
}

