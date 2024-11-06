import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import React, { useState } from "react";

const UserActivity = ({ title, activity }) => {
  const [page, setPage] = useState(0);
  const handleChangePage = (page) => {
    setPage(page);
  };

  const columns = [
    {
      id: "name",
      name: "Name",
      image: "image",
      isPicture: true,
    },
    {
      id: "email",
      name: "Email",
    },
    {
      id: "event",
      name: "Event",
    },
    {
      id: "date",
      name: "Date",
    },
    {
      id: "detail",
      name: "Details",
    },
    {
      id: "action",
      isAction: false,
    },
  ];

  return (
    <Card>
      <header className="p-5 pb-4 border-b border-slate-100">
        <h2 className="font-medium text-[#1E293B]">{title}</h2>
      </header>
      {activity && (
        <>
          <Table
            columns={columns}
            rowData={activity}
            page={page}
            rowsPerPage={10}
          />
          <div className="p-4 border-t">
            <Pagination
              page={page}
              max={10}
              total={activity.length}
              handleChangePage={handleChangePage}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default UserActivity;
