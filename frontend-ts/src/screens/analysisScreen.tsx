import FileView from "@/components/fileView";
import Overview from "@/components/overview";
import {parseFileAsync, useAppDispatch, useAppSelector} from "@/store";
import {
    FileExcelFilled,
    FileTextOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import {Avatar, Button, Tabs, Typography} from "antd";
import Chart from 'react-apexcharts';
import CreateGraphModal from "@/components/createGraphModal.tsx";
import {useEffect, useState} from "react";

const {Text} = Typography;

export default function AnalysisScreen() {
    const {
        currentFile,
        analysisData,
        header,
        skipEmptyLines,
        data,
        columns,
    } = useAppSelector((state) => state.main);

    const dispatch = useAppDispatch();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!currentFile) return;

        if (!data || !columns) {
            dispatch(parseFileAsync({currentFile, header, skipEmptyLines}));
        }
    }, [currentFile, data, columns, header, skipEmptyLines, dispatch]);

    useEffect(() => {
        if (analysisData) {
            console.log("Analysis Ready:", analysisData);
        }
    }, [analysisData]);
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
                            icon={<FileExcelFilled/>}
                        />
                        <Text strong className="text-lg">
                            {currentFile.name}
                        </Text>
                        <span className="text-lg font-bold text-gray-500">&bull;</span>
                        <Text strong>{(currentFile.size / 1024).toFixed(2)}KB</Text>
                    </div>
                    <div>
                        <Button type={'primary'} onClick={() => setShowModal(true)}>Create Graph</Button>
                    </div>
                </div>
                <div>
                    <Tabs
                        defaultActiveKey="overview"
                        items={[
                            {
                                key: "overview",
                                label: "Overview",
                                icon: <FileTextOutlined/>,
                                children: (
                                    <div className="dark:bg-dark-bg">
                                        <Overview/>
                                    </div>
                                ),
                            },
                            {
                                key: "all",
                                label: "All Data",
                                icon: <UnorderedListOutlined/>,
                                children: <FileView/>,
                            },
                            {
                                key: "Data And Graphs",
                                label: "Data And Graphs",
                                icon: <UnorderedListOutlined/>,
                                children: <div>
                                    <Chart
                                        type={'line'}
                                        height={350}
                                        series={[
                                            {name: "Series A", data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]},
                                            {name: "Series B", data: [20, 29, 37, 36, 44, 45, 50, 58]}
                                        ]}
                                        options={{
                                            chart: {stacked: false},
                                            dataLabels: {enabled: false},
                                            colors: ["#FF1654", "#247BA0"],
                                            stroke: {width: [4, 4]},
                                            plotOptions: {bar: {columnWidth: "20%"}},
                                            xaxis: {categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]},
                                            yaxis: [
                                                {
                                                    axisTicks: {show: true},
                                                    axisBorder: {show: true, color: "#FF1654"},
                                                    labels: {style: {colors: "#FF1654"}},
                                                    title: {text: "Series A", style: {color: "#FF1654"}}
                                                },
                                                {
                                                    opposite: true,
                                                    axisTicks: {show: true},
                                                    axisBorder: {show: true, color: "#247BA0"},
                                                    labels: {style: {colors: "#247BA0"}},
                                                    title: {text: "Series B", style: {color: "#247BA0"}}
                                                }
                                            ],
                                            tooltip: {shared: false, intersect: true, x: {show: false}},
                                            legend: {horizontalAlign: "left", offsetX: 40}
                                        }}
                                    />
                                </div>
                            },
                        ]}
                    />
                </div>
            </div>
            <CreateGraphModal showModal={showModal} setShowModal={setShowModal}/>
        </div>
    );
}
