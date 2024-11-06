import React, { useEffect, useState } from "react";
import Sidebar from "@/components/partials/Sidebar";
import Header from "@/components/partials/Header";
import useCheckMobileScreen from "@/hooks/useCheckMobileScreen";
import { useRouter } from "next/router";
import {
  isPageRestrictedForRole,
  redirectToDefaultPage,
} from "@/utils/roleManagement";
import { getAuthUser } from "@/utils/auth";

const DashboardLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useCheckMobileScreen(768);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const router = useRouter();
  const user = getAuthUser();

  // Redirect if role is not allowed on this page
  useEffect(() => {
    const currentPage = router.pathname;

    if (isPageRestrictedForRole(user.role, currentPage)) {
      console.log("Pushing to default");
      redirectToDefaultPage(user.role, router);
    }
  }, [user, router]);

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1">
        {/*  Site header */}
        <Header
          title={title}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="relative h-full overflow-y-hidden">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
