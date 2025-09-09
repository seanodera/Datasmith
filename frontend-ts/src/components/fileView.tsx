import { useAppSelector } from "@/store";
import { Table } from "antd";
import Papa from "papaparse";
import { useEffect, useState } from "react";

export default function FileView() {
    const {currentFile,header,skipEmptyLines} = useAppSelector((state) => state.main);
      const [data, setData] = useState<Record<string,string|number>[]| unknown[]>([]);
  const [columns, setColumns] = useState<{ title: string; dataIndex: string; key: string; }[]>([]);


useEffect(() => {
    if (!currentFile) return;
     Papa.parse(currentFile, {
      header: header, // first row = column headers
      skipEmptyLines: skipEmptyLines,
      complete: (results) => {
        console.log("Parsed CSV:", results.data);
        setData(results.data);

        if (results.data.length > 0) {
          const cols = Object.keys(results.data[0] as object).map((key) => ({
            title: key,
            dataIndex: key,
            key,
          }));
          setColumns(cols);
        }
      },
    });
}, [currentFile, header, skipEmptyLines]);

  return <div><Table 
  className="mt-4"
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}/></div>;
}