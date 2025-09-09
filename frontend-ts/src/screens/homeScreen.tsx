import {
  CloudUploadOutlined,
  FileExcelFilled,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Typography,
  Upload,
  message,
  Progress,
} from "antd";
import { UploadFile } from "antd/es/upload";
import { useState } from "react";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const HomeScreen = () => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(20);
  const MAX_FILE_SIZE_MB = 10; // set limit here

  const props = {
    name: "file",
    multiple: false,
    accept: ".csv,.xls,.xlsx",
    beforeUpload: (file: File) => {
      const isCSV =
        file.type === "text/csv" || file.name.endsWith(".csv");
      const isExcel =
        file.type.includes("sheet") || /\.(xls|xlsx)$/.test(file.name);

      if (!isCSV && !isExcel) {
        message.error("Only CSV or Excel files are allowed.");
        return Upload.LIST_IGNORE;
      }

      const isTooLarge =
        file.size / 1024 / 1024 > MAX_FILE_SIZE_MB;
      if (isTooLarge) {
        message.error(
          `File must be smaller than ${MAX_FILE_SIZE_MB}MB.`
        );
        return Upload.LIST_IGNORE;
      }

      console.log("File ready:", file);
      setCurrentFile(file);
      setUploadProgress(0);
      return false; // prevent auto-upload for now
    },
    onChange(info: { file: UploadFile; fileList: UploadFile[] }) {
      const { status, name, percent } = info.file;

      if (percent) {
        setUploadProgress(Math.floor(percent));
      }

      if (status === "done") {
        message.success(`${name} file uploaded successfully.`);
        setUploadProgress(100);
      } else if (status === "error") {
        message.error(`${name} file upload failed.`);
        setUploadProgress(0);
      }
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen ">
      {currentFile ? (
        <Card className="!max-w-screen-md !w-full p-8 shadow-xl">
          <Title level={4}>Complete Upload</Title>
          <div className="flex flex-col items-center gap-4">
            <Avatar
              shape="square"
              className="bg-transparent"
              size={64}
              icon={<FileExcelFilled />}
            />
            <Text strong>
              {currentFile.name}{" "}
              {(currentFile.size / 1024).toFixed(2)}KB
            </Text>
          </div>

          {/* Progress bar */}
          {uploadProgress > 0 && (
            <div className="w-full mt-6">
              <Progress
                percent={uploadProgress}
                status={
                  uploadProgress === 100 ? "success" : "active"
                }
              />
            </div>
          )}

          <div className="flex gap-8 items-center justify-center mt-8">
            <Button
              type="primary"
              className="mt-4"
              onClick={() => {
                // TODO: hook into backend upload via Fetch or Axios
                message.info("Sending file to backend...");
              }}
            >
              Proceed
            </Button>
            <Button
              danger
              className="mt-4"
              onClick={() => {
                setCurrentFile(null);
                setUploadProgress(0);
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="!max-w-screen-md !w-full p-8 shadow-xl">
          <Title level={4}>Upload Your File</Title>
          <Dragger {...props} className="p-6">
            <CloudUploadOutlined className="text-4xl mb-2 !text-accent" />
            <br />
            <Text strong>
              Click or drag file to this area to upload
            </Text>
            <br />
            <Text type="secondary">
              Supports: .csv, .xls, .xlsx (max {MAX_FILE_SIZE_MB}MB)
            </Text>
          </Dragger>
        </Card>
      )}
    </div>
  );
};

export default HomeScreen;