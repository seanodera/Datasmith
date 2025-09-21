import { useAppSelector } from "@/store";
import { Card, Typography, Descriptions } from "antd";

const { Title, Text } = Typography;

export default function Overview() {
  const { currentFile, analysisData } = useAppSelector((state) => state.main);

  if (!analysisData || !currentFile) {
    return <div>Loading analysis...</div>;
  }

  const { metadata, numerical_analysis, categorical_analysis } =
    analysisData.results;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
                  {/* File Details */}
      <Card>
        <Title level={4}>File Details</Title>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">{currentFile.name}</Descriptions.Item>
          <Descriptions.Item label="Size">
            {(currentFile.size / 1024).toFixed(2)} KB
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {currentFile.type || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Modified">
            {currentFile.lastModified
              ? new Date(currentFile.lastModified).toLocaleDateString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Total Rows">
            {metadata.total_rows}
          </Descriptions.Item>
          <Descriptions.Item label="Total Columns">
            {metadata.total_columns}
          </Descriptions.Item>
        </Descriptions>
      </Card>
        </div>

      <div>
        {/* Numerical Columns */}
      <Card>
        <Title level={4}>Numerical Columns Summary</Title>
        {Object.keys(numerical_analysis).length === 0 ? (
          <Text>No numerical columns found.</Text>
        ) : (
          Object.entries(numerical_analysis).map(([colName, stats]) => (
            <Descriptions
              key={colName}
              title={colName}
              column={1}
              bordered
              size="small"
              className="mb-4"
            >
              <Descriptions.Item label="Mean">
                {stats.mean ?? "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Median">
                {stats.median ?? "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Std Dev">
                {stats.std ?? "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Min">
                {stats.min ?? "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Max">
                {stats.max ?? "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Q1">
                {stats.q1 ?? "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Q3">
                {stats.q3 ?? "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Missing Values">
                {stats.missing_values}
              </Descriptions.Item>
            </Descriptions>
          ))
        )}
      </Card>
      </div>

      <div>
        {/* Categorical Columns */}
      <Card>
        <Title level={4}>Categorical Columns Summary</Title>
        {!categorical_analysis || Object.keys(categorical_analysis).length === 0 ? (
          <Text>No categorical columns found.</Text>
        ) : (
          Object.entries(categorical_analysis).map(([colName, stats]) => (
            <Descriptions
              key={colName}
              title={colName}
              column={1}
              bordered
              size="small"
              className="mb-4"
            >
              <Descriptions.Item label="Unique Values">
                {stats.unique_values}
              </Descriptions.Item>
              <Descriptions.Item label="Most Frequent">
                {stats.most_common_value ?? "N/A"} (
                {stats.most_common_count})
              </Descriptions.Item>
              <Descriptions.Item label="Missing Values">
                {stats.missing_values}
              </Descriptions.Item>
            </Descriptions>
          ))
        )}
      </Card>
      </div>
    </div>
  );
}