import { useEffect, useState } from "react";
import { JSX, FC } from "react";
import { DataGrid, GridColDef, GridPaginationModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { Button, Box, Toolbar, Typography } from "@mui/material";
import { CloudDownload, Delete } from "@mui/icons-material";
import axios from "axios";

interface Certificate {
  id: number;
  name: string;
  provider: string;
  issued_at: string;
  expires_at: string | null;
}

const Table: FC = (): JSX.Element => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchCertificates = async (): Promise<void> => {
      try {
        const response = await axios.get<Certificate[]>("/certificates/getall");
        setCertificates(response.data || []);
        setError("");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || "Network error. Please try again later.");
        } else {
          setError("Unknown error occurred.");
        }
      }
    };

    fetchCertificates();
  }, []);

  const handleDownload = async (): Promise<void> => {
    if (selectedRows.length === 0) {
      alert("Please select at least one certificate to download.");
      return;
    }

    const selectedCertificates = certificates.filter((certificate) =>
      selectedRows.includes(certificate.id)
    );
    selectedCertificates.forEach(async (certificate) => {
      try {
        const response = await axios.get(`/certificates/download/`, {
          responseType: "blob", 
          headers: { "certificate-id": String(certificate.id) },
        });

        let filename = `certificate_${certificate.name}`;
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) {
            filename = match[1];
            const parts = filename.split(".");
            if (parts.length > 1) {
              const extension = parts.pop();
              filename = `${certificate.name}.${extension}`;
            }
          }
        }

        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || "Network error. Please try again later.");
        } else {
          setError("Unknown error occurred.");
        }
      }
    }
  )};

  const handleDownloadAll = async (): Promise<void> => {
    try {
      const response = await axios.get("/certificates/downloadall", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "certificates.zip";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Network error. Please try again later.");
      } else {
        setError("Unknown error occurred.");
      }
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (selectedRows.length === 0) {
      setError("Please select at least one certificate to delete.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete the selected certificates?")) return;
    try {
      await Promise.all(
        selectedRows.map(async (id) => {
          await axios.delete("/certificates/delete", {
            headers: { "certificate-id": String(id) },
          });
        })
      );
      alert("Certificates deleted successfully!");
      setCertificates((prev) => prev.filter((c) => !selectedRows.includes(c.id)));
      setSelectedRows([]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Network error. Please try again later.");
      } else {
        setError("Unknown error occurred.");
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 100 },
    { field: "name", headerName: "Certificate Name", flex: 1, minWidth: 200 },
    { field: "provider", headerName: "Provider", flex: 1, minWidth: 200 },
    {
      field: "issued_at",
      headerName: "Issue Date",
      width: 150,
      renderCell: (params) => (
        <Typography>{new Date(params.value as string).toLocaleDateString()}</Typography>
      ),
    },
    {
      field: "expires_at",
      headerName: "Expiry Date",
      width: 150,
      renderCell: (params) => (
        <Typography>{params.value ? new Date(params.value as string).toLocaleDateString() : "N/A"}</Typography>
      ),
    },
  ];

  return (
    <Box
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        margin: "0 auto",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          width: "100%",
        }}
      >
        {error && <div className="error-message">{error}</div>}
        <Typography variant="h6" sx={{ textAlign: { xs: "center", sm: "left" } }}>
          Certificate Manager
        </Typography>
        <Box className="button-container">
          <Button variant="contained" color="primary" startIcon={<CloudDownload />} onClick={handleDownload}>
            Download
          </Button>
          <Button variant="contained" color="primary" startIcon={<CloudDownload />} onClick={handleDownloadAll}>
            Download All
          </Button>
          <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Toolbar>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DataGrid
          rows={certificates}
          columns={columns}
          paginationModel={paginationModel}
          pageSizeOptions={[10, 20, 30]}
          checkboxSelection
          onRowSelectionModelChange={(ids: GridRowSelectionModel) => {
            const selectedIds = ids.map((id) => Number(id));
            setSelectedRows(selectedIds);
           }}
          onPaginationModelChange={setPaginationModel}
          sx={{
            width: "100%",
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              wordBreak: "break-word",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "14px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Table;
