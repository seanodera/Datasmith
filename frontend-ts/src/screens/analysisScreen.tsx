import FileView from "@/components/fileView";
import Overview from "@/components/overview";
import { useAppSelector } from "@/store";
import {
  FileExcelFilled,
  FileTextOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Avatar, Tabs, Typography } from "antd";

const { Text } = Typography;

export default function AnalysisScreen() {
  const { currentFile, analysisData } = useAppSelector((state) => state.main);

  if (!analysisData || !currentFile) {
    return <div>Loading analysis...</div>;
  }
  return (
    <div>
      <div className="bg-white dark:bg-dark p-8 shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Avatar
              shape="square"
              className="bg-transparent"
              size={"large"}
              icon={<FileExcelFilled />}
            />
            <Text strong className="text-lg">
              {currentFile.name}
            </Text>
            <span className="text-lg font-bold text-gray-500">&bull;</span>
            <Text strong>{(currentFile.size / 1024).toFixed(2)}KB</Text>
          </div>
        </div>
        <div>
          <Tabs
            defaultActiveKey="overview"
            items={[
              {
                key: "overview",
                label: "Overview",
                icon: <FileTextOutlined />,
                children: (
                  <div className="bg-light-bg dark:bg-dark-bg">
                    <Overview />
                  </div>
                ),
              },
              {
                key: "all",
                label: "All Data",
                icon: <UnorderedListOutlined />,
                children: <FileView />,
              },
              {
                key: "Data And Graphs",
                label: "Data And Graphs",
                icon: <UnorderedListOutlined />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
