import {parseFileAsync, useAppDispatch, useAppSelector} from "@/store";
import {Table} from "antd";
import {useEffect, useState} from "react";

export default function FileView() {
    const {currentFile, header, skipEmptyLines,data,columns,parsing} = useAppSelector((state) => state.main);
    const  dispatch = useAppDispatch();
    const [perPage, setPerPage] = useState(10);
    useEffect(() => {
        if (!currentFile) return;
        if (!data || !columns){
            dispatch(parseFileAsync({currentFile, header, skipEmptyLines}));
        }

    }, [columns, currentFile, data, dispatch, header, skipEmptyLines]);

    return <div><Table
        className="mt-4"
        loading={!data || data && data.length === 0 || parsing}
        dataSource={data}
        columns={columns}
        pagination={{
            pageSize: perPage, onShowSizeChange(_, size) {
                setPerPage(size);
            },
        }}

        scroll={{x: true}}/></div>;
}