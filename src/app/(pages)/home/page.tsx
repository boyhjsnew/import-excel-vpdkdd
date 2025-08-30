"use client";

import React, { useState, useMemo } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import * as XLSX from "xlsx";

interface DataRow {
  stt: number;
  ma_dt: string;
  diaChi: string;
  assignService: string;
}

interface ExcelRow {
  "Ký hiệu": string;
  "Số đơn hàng": string;
  "Ngày biên lai": string;
  "Tên người nộp": string;
  "Tên đơn vị nộp": string;
  "Địa chỉ": string;
  "Mã số thuế": string;
  "Email khách hàng": string;
  "Số HS": string;
  "Ngày HS": string;
  "HT thanh toán": string;
  "Mã phí": string;
  "Tên loại phí": string;
  "Số tiền": number;
  "Đơn vị thu": string;
}

// Interface cho dữ liệu lỗi
interface ErrorRow extends ExcelRow {
  errorCode: string;
  errorMessage: string;
  rowIndex: number;
}

interface ApiRequest {
  tab_masters: string;
  editmode: number;
  data: Array<{
    tdlap: string;
    khieu: string;
    cctbao_id: string;
    dvtte: string;
    tgia: number;
    htttoan: string;
    sdhang: string;
    emailnban: string;
    sdt_ngban: string;
    stknban: string;
    nganhang_ngban: string;
    ma_ch: string;
    ten_ch: string;
    mst: string;
    mnmua: string;
    tnmua: string;
    email: string;
    so_hs: string;
    ngay_hs: string;
    dv_thu: string;
    ten: string;
    dchi: string;
    stknmua: string;
    nganhang_ngmua: string;
    cccdan: string;
    so_hchieu: string;
    mdvqhnsach_nmua: string;
    mccqthue: number;
    theomh: number;
    tgtttbso: number;
    details: Array<{
      tab_details: string;
      data: Array<{
        tchat: number;
        cthuc: number;
        stt: number;
        ma: string;
        tgtien: number;
        ma_hanghoa: string;
        ten: string;
        mdvtinh: null;
        dgia: null;
        value: string;
        ma_hv: string;
        ten_hv: string;
        ma_dvt: null;
        gia_ban: null;
        ma_thue: number;
        tsuat: number;
      }>;
    }>;
  }>;
}

const Home = () => {
  const [data, setData] = useState<DataRow[]>([
    {
      stt: 1,
      ma_dt: "ABC",
      diaChi: "12 pdl quận bình thạnh",
      assignService: "Tạo tra cứu",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [getIDRow] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [errorData, setErrorData] = useState<ErrorRow[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const toast = useRef<Toast>(null);

  const columns = useMemo<MRT_ColumnDef<DataRow>[]>(
    () => [
      {
        accessorKey: "stt",
        header: "STT",
        size: 80,
        enableSorting: true,
      },
      {
        accessorKey: "ma_dt",
        header: "Mã đối tượng",
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "diaChi",
        header: "Địa chỉ",
        size: 300,
        enableSorting: true,
      },
    ],
    []
  );

  const handleImportExcel = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setImportProgress(0);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadTemplate = () => {
    // Tạo file mẫu Excel với các cột yêu cầu
    const templateData: ExcelRow[] = [
      {
        "Ký hiệu": "EBL01-25T",
        "Số đơn hàng": "1",
        "Ngày biên lai": "15/01/2024",
        "Tên người nộp": "Nguyễn Văn A",
        "Tên đơn vị nộp": "Công ty TNHH ABC",
        "Địa chỉ": "123 Đường ABC, Quận 1, TP.HCM",
        "Mã số thuế": "0313364566",
        "Email khách hàng": "nguyenvana@example.com",
        "Số HS": "HS001",
        "Ngày HS": "10/01/2024",
        "HT thanh toán": "Chuyển khoản",
        "Mã phí": "1",
        "Tên loại phí": "Phí đăng ký đất đai",
        "Số tiền": 500000,
        "Đơn vị thu": "Quận 1",
      },
    ];

    // Tạo workbook và worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Đặt độ rộng cột
    const columnWidths = [
      { wch: 12 }, // Ký hiệu
      { wch: 15 }, // Số đơn hàng
      { wch: 15 }, // Ngày biên lai
      { wch: 20 }, // Tên người nộp
      { wch: 25 }, // Tên đơn vị nộp
      { wch: 35 }, // Địa chỉ
      { wch: 15 }, // Mã số thuế
      { wch: 25 }, // Email khách hàng
      { wch: 12 }, // Số HS
      { wch: 15 }, // Ngày HS
      { wch: 15 }, // HT thanh toán
      { wch: 12 }, // Mã phí
      { wch: 25 }, // Tên loại phí
      { wch: 15 }, // Số tiền
    ];
    ws["!cols"] = columnWidths;

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Tạo file Excel và download
    XLSX.writeFile(wb, "template_bien_lai.xlsx");

    toast.current?.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đã tải file mẫu Excel thành công",
      life: 3000,
    });
  };

  const convertExcelRowToDetail = (row: ExcelRow, index: number) => {
    return {
      tchat: 5,
      cthuc: 1,
      stt: index + 1,
      ma: row["Mã phí"] || "1",
      tgtien: row["Số tiền"] || 0,
      ma_hanghoa: row["Mã phí"] || "1",
      ten: row["Tên loại phí"] || "",
      mdvtinh: null,
      dgia: null,
      value: row["Tên loại phí"] || "",
      ma_hv: row["Mã phí"],
      ten_hv: row["Tên loại phí"] || "",
      ma_dvt: null,
      gia_ban: null,
      ma_thue: 0,
      tsuat: 0,
    };
  };

  const groupExcelDataByOrderNumber = (jsonData: ExcelRow[]) => {
    const groupedData = new Map<string, ExcelRow[]>();

    jsonData.forEach((row) => {
      const orderNumber = String(row["Số đơn hàng"] || ""); // Chuyển đổi thành string
      if (!groupedData.has(orderNumber)) {
        groupedData.set(orderNumber, []);
      }
      groupedData.get(orderNumber)!.push(row);
    });

    return groupedData;
  };

  const convertGroupedDataToApiData = (
    orderNumber: string,
    rows: ExcelRow[]
  ): ApiRequest["data"][0] => {
    // Lấy thông tin từ dòng đầu tiên của nhóm
    const firstRow = rows[0];

    // Chuyển đổi ngày từ dd/mm/yyyy sang yyyy-mm-dd
    const convertDate = (
      dateValue: string | number | Date | null | undefined
    ) => {
      if (!dateValue) {
        return new Date().toISOString().slice(0, 19).replace("T", " ");
      }

      // Nếu là Date object
      if (dateValue instanceof Date) {
        return dateValue.toISOString().slice(0, 19).replace("T", " ");
      }

      // Nếu là string
      if (typeof dateValue === "string") {
        const parts = dateValue.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
            2,
            "0"
          )} 00:00`;
        }
      }

      // Nếu là number (Excel date serial number)
      if (typeof dateValue === "number") {
        const date = new Date((dateValue - 25569) * 86400 * 1000);
        return date.toISOString().slice(0, 19).replace("T", " ");
      }

      // Fallback
      return new Date().toISOString().slice(0, 19).replace("T", " ");
    };

    // Tính tổng số tiền từ tất cả các dòng trong nhóm
    const totalAmount = rows.reduce((sum, row) => {
      return sum + (row["Số tiền"] || 0);
    }, 0);

    // Tạo details từ tất cả các dòng trong nhóm
    const details = rows.map((row, index) =>
      convertExcelRowToDetail(row, index)
    );

    return {
      tdlap: convertDate(firstRow["Ngày biên lai"]),
      khieu: firstRow["Ký hiệu"] || "",
      cctbao_id: "786a2885-9d92-4e08-a494-717d960b4842",
      dvtte: "VND",
      tgia: 1,
      htttoan: firstRow["HT thanh toán"] || "TM/CK",
      sdhang: firstRow["Số đơn hàng"] || "", // Lấy từ cột "Số đơn hàng"
      emailnban: "",
      sdt_ngban: "",
      stknban: "",
      nganhang_ngban: "",
      ma_ch: "",
      ten_ch: "",
      mst: firstRow["Mã số thuế"] || "",
      mnmua: "",
      tnmua: firstRow["Tên người nộp"] || "",
      email: firstRow["Email khách hàng"] || "",
      so_hs: firstRow["Số HS"] || "",
      ngay_hs: convertDate(firstRow["Ngày HS"] || ""),
      dv_thu: firstRow["Đơn vị thu"],
      ten: firstRow["Tên đơn vị nộp"] || "",
      dchi: firstRow["Địa chỉ"] || "",
      stknmua: "",
      nganhang_ngmua: "",
      cccdan: "",
      so_hchieu: "",
      mdvqhnsach_nmua: "",
      mccqthue: 1,
      theomh: 0,
      tgtttbso: totalAmount, // Tổng số tiền của tất cả dòng trong nhóm
      details: [
        {
          tab_details: "hoadon68_chitiet",
          data: details,
        },
      ],
    };
  };

  const callApiForOrder = async (
    apiData: ApiRequest["data"][0],
    orderNumber: string
  ): Promise<{
    success: boolean;
    errorCode?: string;
    errorMessage?: string;
  }> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }

      const requestBody: ApiRequest = {
        tab_masters: "hoadon68",
        editmode: 1,
        data: [apiData],
      };

      const response = await fetch(
        "https://0313364566.minvoice.com.vn/api/Pattern/Save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`API response for order ${orderNumber}:`, result);

      // Kiểm tra response code
      if (result.code === "00") {
        return { success: true };
      } else {
        // Xử lý các trường hợp lỗi khác nhau
        let errorMessage = "Lỗi không xác định";

        if (result.message) {
          errorMessage = result.message;
        } else if (result.data && result.data.Message) {
          errorMessage = result.data.Message;
        }

        console.log(`API error for order ${orderNumber}:`, {
          code: result.code,
          message: errorMessage,
        });

        return {
          success: false,
          errorCode: result.code,
          errorMessage: errorMessage,
        };
      }
    } catch (error) {
      console.error(`API call failed for order ${orderNumber}:`, error);
      return {
        success: false,
        errorCode: "ERROR",
        errorMessage: error instanceof Error ? error.message : "Lỗi kết nối",
      };
    }
  };

  // Hàm xuất file Excel lỗi
  const exportErrorData = () => {
    if (errorData.length === 0) return;

    // Format lại dữ liệu và thêm thông tin lỗi
    const exportData = errorData.map(({ errorCode, errorMessage, ...rest }) => {
      // Format lại các cột ngày
      const formattedData = { ...rest };

      // Format "Ngày biên lai"
      if (formattedData["Ngày biên lai"]) {
        formattedData["Ngày biên lai"] = formatExcelDate(
          formattedData["Ngày biên lai"]
        );
      }

      // Format "Ngày HS"
      if (formattedData["Ngày HS"]) {
        formattedData["Ngày HS"] = formatExcelDate(formattedData["Ngày HS"]);
      }

      // Thêm thông tin lỗi vào cuối
      return {
        ...formattedData,
        "Mã lỗi": errorCode,
        "Thông báo lỗi": errorMessage,
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dữ liệu lỗi");

    // Tạo tên file với timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `du_lieu_loi_${timestamp}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  // Hàm format Excel date
  const formatExcelDate = (
    dateValue: string | number | Date | null | undefined
  ): string => {
    if (!dateValue) return "";

    // Nếu là số (Excel date serial number)
    if (typeof dateValue === "number") {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toLocaleDateString("vi-VN");
    }

    // Nếu là Date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString("vi-VN");
    }

    // Nếu là string, kiểm tra xem có phải là ngày hợp lệ không
    if (typeof dateValue === "string") {
      // Nếu đã là format dd/mm/yyyy thì giữ nguyên
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
        return dateValue;
      }

      // Thử parse thành Date
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("vi-VN");
      }
    }

    // Fallback: trả về giá trị gốc
    return String(dateValue);
  };

  // Columns cho table lỗi
  const errorColumns = useMemo<MRT_ColumnDef<ErrorRow>[]>(
    () => [
      {
        accessorKey: "rowIndex",
        header: "STT",
        size: 60,
      },
      {
        accessorKey: "Ký hiệu",
        header: "Ký hiệu",
        size: 120,
      },
      {
        accessorKey: "Số đơn hàng",
        header: "Số đơn hàng",
        size: 150,
      },
      {
        accessorKey: "Ngày biên lai",
        header: "Ngày biên lai",
        size: 120,
      },
      {
        accessorKey: "Tên người nộp",
        header: "Tên người nộp",
        size: 200,
      },
      {
        accessorKey: "Tên đơn vị nộp",
        header: "Tên đơn vị nộp",
        size: 200,
      },
      {
        accessorKey: "Địa chỉ",
        header: "Địa chỉ",
        size: 250,
      },
      {
        accessorKey: "Mã số thuế",
        header: "Mã số thuế",
        size: 150,
      },
      {
        accessorKey: "Email khách hàng",
        header: "Email khách hàng",
        size: 200,
      },
      {
        accessorKey: "Số HS",
        header: "Số HS",
        size: 120,
      },
      {
        accessorKey: "Ngày HS",
        header: "Ngày HS",
        size: 120,
      },
      {
        accessorKey: "HT thanh toán",
        header: "HT thanh toán",
        size: 120,
      },
      {
        accessorKey: "Mã phí",
        header: "Mã phí",
        size: 120,
      },
      {
        accessorKey: "Tên loại phí",
        header: "Tên loại phí",
        size: 200,
      },
      {
        accessorKey: "Số tiền",
        header: "Số tiền",
        size: 120,
      },
      {
        accessorKey: "errorCode",
        header: "Mã lỗi",
        size: 100,
      },
      {
        accessorKey: "errorMessage",
        header: "Thông báo lỗi",
        size: 300,
      },
    ],
    []
  );

  const handleReceiveFile = async () => {
    if (!selectedFile) {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng chọn file trước khi nhận",
        life: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      setImportProgress(0);
      setErrorData([]);

      // Đọc file Excel
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Lấy sheet đầu tiên
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Chuyển đổi thành JSON
      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

      console.log("Dữ liệu từ Excel:", jsonData);

      // Validate dữ liệu bắt buộc
      const requiredFields = ["Ký hiệu", "Số đơn hàng", "Ngày biên lai"];
      const invalidRows = jsonData.filter((row) => {
        return requiredFields.some((field) => !row[field as keyof ExcelRow]);
      });

      if (invalidRows.length > 0) {
        toast.current?.show({
          severity: "error",
          summary: "Lỗi dữ liệu",
          detail: `Có ${invalidRows.length} dòng thiếu thông tin bắt buộc (Ký hiệu, Số đơn hàng, Ngày biên lai)`,
          life: 5000,
        });
        return;
      }

      // Gom nhóm dữ liệu theo số đơn hàng
      const groupedData = groupExcelDataByOrderNumber(jsonData);
      const orderNumbers = Array.from(groupedData.keys());

      console.log("Dữ liệu đã gom nhóm:", groupedData);

      // Xử lý từng nhóm đơn hàng và gọi API
      let successCount = 0;
      let errorCount = 0;
      const tempErrorData: ErrorRow[] = [];

      for (let i = 0; i < orderNumbers.length; i++) {
        const orderNumber = orderNumbers[i];
        const rows = groupedData.get(orderNumber)!;
        const apiData = convertGroupedDataToApiData(orderNumber, rows);

        const result = await callApiForOrder(apiData, orderNumber);

        console.log(`Kết quả API cho đơn hàng ${orderNumber}:`, result);

        if (result.success) {
          successCount++;
          console.log(`Đơn hàng ${orderNumber} thành công`);
        } else {
          errorCount++;
          console.log(`Đơn hàng ${orderNumber} lỗi: ${result.errorMessage}`);

          // Thêm tất cả các dòng của đơn hàng này vào danh sách lỗi
          rows.forEach((row) => {
            const errorRow: ErrorRow = {
              ...row,
              errorMessage: result.errorMessage || "Lỗi không xác định",
              errorCode: result.errorCode || "ERROR",
              rowIndex: tempErrorData.length + 1, // Sử dụng index thực tế
            };
            tempErrorData.push(errorRow);
            console.log(`Thêm dòng lỗi ${errorRow.rowIndex}:`, {
              "Số đơn hàng": errorRow["Số đơn hàng"],
              "Ký hiệu": errorRow["Ký hiệu"],
              Lỗi: errorRow.errorMessage,
            });
          });
        }

        // Cập nhật progress
        setImportProgress(((i + 1) / orderNumbers.length) * 100);
      }

      console.log("Tổng số dòng lỗi thu thập được:", tempErrorData.length);
      console.log("Dữ liệu lỗi chi tiết:", tempErrorData);

      // Cập nhật danh sách lỗi
      setErrorData(tempErrorData);

      // Hiển thị kết quả
      if (errorCount === 0) {
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: `Đã import thành công ${successCount} đơn hàng với ${jsonData.length} dòng chi tiết`,
          life: 5000,
        });
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Hoàn thành với lỗi",
          detail: `Thành công: ${successCount} đơn hàng, Lỗi: ${errorCount} đơn hàng. Có ${tempErrorData.length} dòng bị lỗi.`,
          life: 5000,
        });

        // Tự động mở modal lỗi nếu có lỗi
        if (tempErrorData.length > 0) {
          setShowErrorModal(true);
        }
      }

      // Cập nhật table
      const processedData = jsonData.map((row, index) => ({
        stt: index + 1,
        ma_dt: row["Mã số thuế"] || "",
        diaChi: row["Địa chỉ"] || "",
        assignService: "Tạo tra cứu",
      }));

      setData(processedData);
    } catch (error) {
      console.error("Lỗi khi đọc file Excel:", error);
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
      setImportProgress(0);
      setIsModalOpen(false);
      setSelectedFile(null);
    }
  };

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <button
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium flex items-center"
        onClick={handleDownloadTemplate}
      >
        Tải file mẫu
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        onClick={handleReceiveFile}
        disabled={!selectedFile || isLoading}
      >
        {isLoading
          ? `Đang xử lý... ${Math.round(importProgress)}%`
          : "Nhận file"}
      </button>
      <button
        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium flex items-center"
        onClick={handleCloseModal}
        disabled={isLoading}
      >
        Đóng
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Toast ref={toast} />

      {/* Header với button hiển thị số lỗi */}
      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý user tra cứu</h1>
        <div className="flex gap-2">
          {errorData.length > 0 && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium flex items-center"
              onClick={() => {
                console.log("Mở modal lỗi, số dòng lỗi:", errorData.length);
                setShowErrorModal(true);
              }}
            >
              Xem lỗi ({errorData.length} dòng)
            </button>
          )}
        </div>
      </div> */}

      {/* MaterialReactTable */}
      <Card className="bg-white shadow-sm">
        <MaterialReactTable
          muiTablePaperProps={{
            sx: {
              flex: "1 1 0",
              display: "flex",
              "flex-flow": "column",
            },
          }}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableStickyFooter
          enableSorting={true}
          enableGlobalFilter={true}
          enableColumnFilters={false}
          initialState={{
            columnPinning: { right: ["assignService"] },
            // pagination: { pageSize: 300 }, // Sửa giá trị pagination
          }}
          state={{ isLoading: isLoading }}
          muiTableBodyRowProps={({ row }) => ({
            className: getIDRow === row.getValue("ma_dt") ? "selected-row" : "",
            sx: {
              cursor: "pointer",
              height: "8px",
            },
          })}
          muiTableContainerProps={{
            sx: { maxHeight: "calc(95vh - 200px)" },
          }}
          positionPagination="bottom"
          muiPaginationProps={{
            rowsPerPageOptions: [300, 500, 1000],
          }}
          enablePagination={true}
          columns={columns}
          data={data}
          renderTopToolbarCustomActions={() => (
            <Box className="col" style={{ marginLeft: "20px" }}>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium flex items-center"
                onClick={handleImportExcel}
              >
                Nhập excel
              </button>
            </Box>
          )}
        />
      </Card>

      {/* Modal Import Excel */}
      <Dialog
        visible={isModalOpen}
        onHide={handleCloseModal}
        header="Nhập dữ liệu từ Excel"
        footer={modalFooter}
        style={{ width: "500px" }}
        modal
        className="p-fluid"
        position="top"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Chọn file
            </label>
            <input
              type="file"
              id="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg p-1"
            />
          </div>

          {/* Progress bar */}
          {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${importProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Modal hiển thị dữ liệu lỗi */}
      <Dialog
        visible={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        header={`Danh sách dữ liệu lỗi (${errorData.length} dòng)`}
        style={{ width: "90vw", height: "80vh" }}
        modal
        className="p-fluid"
      >
        <div className="mb-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            onClick={exportErrorData}
          >
            Xuất file Excel lỗi
          </button>
        </div>

        <MaterialReactTable
          columns={errorColumns}
          data={errorData}
          enableColumnFilters={false}
          enableSorting={true}
          enableGlobalFilter={true}
          enablePagination={true}
          //   initialState={{
          //     pagination: { pageSize: 50 },
          //   }}
          muiTableContainerProps={{
            sx: { maxHeight: "60vh" },
          }}
          muiTableProps={{
            sx: {
              tableLayout: "fixed",
            },
          }}
        />
      </Dialog>
    </div>
  );
};

export default Home;
