import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { Avatar, Button, Segmented } from "antd";


export default function AppBar() {
    return <div className={'flex justify-between items-center px-8 py-3 bg-white shadow sticky top-0 z-10'}>
<div className="flex gap-2 items-center">
    <Avatar shape="square" size="large" src="/logo.png" />
    <div>
        <h2 className="font-bold text-lg leading-none">Datasmith</h2>
        <span className="text-xs text-gray-500 leading-none">Data Analysis Made Easy</span>
    </div>
</div>
<div className="flex gap-2 items-center">
    <Segmented
    
        shape="round"
        options={[
          { value: 'light', icon: <SunOutlined /> },
          { value: 'dark', icon: <MoonOutlined /> },
        ]}
      />
    <Button type="primary" ghost>About</Button>
</div>
    </div>
}