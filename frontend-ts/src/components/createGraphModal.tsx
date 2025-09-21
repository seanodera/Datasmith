import { Button, Modal, Select } from "antd";
import Chart from "react-apexcharts";
import { ComponentProps, useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

type ChartType = NonNullable<ComponentProps<typeof Chart>["type"]>;
type ChartVariant = "smooth" | "straight" | "stepline";

interface SelectedChart {
  type: ChartType;
  variant?: ChartVariant;
}

export default function CreateGraphModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  const { columns, data } = useAppSelector((state) => state.main);
  const [selectedChart, setSelectedChart] = useState<SelectedChart>();
  const [xAxisData, setXAxisData] = useState<(string | number)[]>([]);
  const [yAxisData, setYAxisData] = useState<(string | number)[]>([]);
  const [xKey, setXKey] = useState<string>();
  const [yKey, setYKey] = useState<string>();
  const [sortKey, setSortKey] = useState<string>();
  const [ascending, setAscending] = useState<boolean>(true);

  const chartTypes: {
    name: string;
    type: ChartType;
    variants?: { name: string; type: ChartVariant }[];
  }[] = [
    {
      name: "Line Chart",
      type: "line",
      variants: [
        { name: "Spline Line Chart", type: "smooth" },
        { name: "Straight Line Chart", type: "straight" },
        { name: "Stepline Line Chart", type: "stepline" },
      ],
    },
    { name: "Bar Chart", type: "bar" },
    { name: "Pie Chart", type: "pie" },
  ];

  // 🔑 Sorting + axis updates
  useEffect(() => {
    if (!xKey || !yKey || !data) return;

    // Build paired dataset
    let paired = data.map((row) => {
      const x = row[xKey];
      const rawY = row[yKey];
      const y = isNaN(Number(rawY)) ? rawY : Number(rawY);
      return { x, y };
    });

    // Sort if sortKey is set
    if (sortKey) {
      paired.sort((a, b) => {
        const valA = sortKey === xKey ? a.x : a.y;
        const valB = sortKey === xKey ? b.x : b.y;

        if (typeof valA === "number" && typeof valB === "number") {
          return ascending ? valA - valB : valB - valA;
        }
        return ascending
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    // Update chart series data
    setXAxisData(paired.map((p) => p.x));
    setYAxisData(paired.map((p) => p.y));
  }, [xKey, yKey, sortKey, ascending, data]);

  return (
    <Modal
      open={showModal}
      onCancel={() => setShowModal(false)}
      title="Create Graph"
      footer={null}
    >
      {/* Chart Type Select */}
      <Select
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Select chart type"
        options={chartTypes.map((chartType) => ({
          label: chartType.name,
          value: chartType.type,
        }))}
        onChange={(value) => setSelectedChart({ type: value as ChartType })}
      />

      {/* Chart Variant Select (if available) */}
      {selectedChart?.type &&
        chartTypes.find((ct) => ct.type === selectedChart.type)?.variants && (
          <Select
            style={{ width: "100%", marginBottom: 16 }}
            placeholder="Select variant"
            options={chartTypes
              .find((chartType) => chartType.type === selectedChart.type)
              ?.variants?.map((variant) => ({
                label: variant.name,
                value: variant.type,
              }))}
            onChange={(value) => {
              setSelectedChart((prev) =>
                prev ? { ...prev, variant: value as ChartVariant } : prev
              );
            }}
          />
        )}

      {/* X Axis Select */}
      {columns && (
        <Select
          className="w-full !mb-4"
          placeholder="Choose X Axis"
          options={columns.map((column) => ({
            label: column.title,
            value: column.dataIndex,
          }))}
          onChange={(value) => setXKey(value)}
        />
      )}

      {/* Y Axis Select */}
      {columns && (
        <Select
          className="w-full !mb-4"
          placeholder="Choose Y Axis"
          options={columns.map((column) => ({
            label: column.title,
            value: column.dataIndex,
          }))}
          onChange={(value) => setYKey(value)}
        />
      )}

      {/* Sorting Controls */}
      {xKey && yKey && (
        <div className="flex gap-4 items-center mb-4">
          <Select
            className="w-full"
            placeholder="Sort By"
            onChange={(value) => setSortKey(value)}
            options={[
              { label: `Sort By ${xKey}`, value: xKey },
              { label: `Sort By ${yKey}`, value: yKey },
            ]}
          />
          <Button
            type="primary"
            ghost
            icon={ascending ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            onClick={() => setAscending(!ascending)}
          />
        </div>
      )}

      {/* Chart Preview */}
      {selectedChart && xKey && yKey && (
        <Chart
          type={selectedChart.type}
          height={350}
          series={[
            {
              name: yKey,
              data: yAxisData as number[],
            },
          ]}
          options={{
            chart: { id: "example" },
            xaxis: {
              categories:
                selectedChart.type === "pie" || selectedChart.type === "donut"
                  ? xAxisData
                  : xAxisData,
            },
            stroke: { curve: selectedChart.variant ?? "smooth" },

          }}
        />
      )}
    </Modal>
  );
}