import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";

const Table = ({ tableData }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10, // Set default page size to 10
  });

  const columns = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];

    return Object.keys(tableData[0]).map((key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      width: "fit-content",
      flex: 1,
      align: typeof tableData[0][key] === "number" ? "right" : "left",
      headerAlign: typeof tableData[0][key] === "number" ? "right" : "left",
    }));
  }, [tableData]);

  return (
    <>
      {tableData && tableData?.length > 0 && (
        <Paper sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]} // Set available page sizes
            checkboxSelection
            pagination
            sx={{ border: 0 }}
          />
        </Paper>
      )}
    </>
  );
};

export default Table;
