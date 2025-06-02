import { IoAirplaneOutline, IoLogoGoogle, IoPlanetOutline, IoSearch, IoSettingsOutline, IoTicketOutline } from "react-icons/io5";
import { PiAirplaneInFlight, PiCityLight, PiExportBold, PiSeat } from "react-icons/pi";
import { BsDiagram2 } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { GoLocation } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { LiaTicketAltSolid } from "react-icons/lia";
import { TbReportAnalytics } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
const size = 20;

const icons = {
    account: <VscAccount size={size} />,
    plane: <IoAirplaneOutline size={size} />,
    airline: <IoPlanetOutline size={size} />,
    airport: <GoLocation size={size} />,
    city: <PiCityLight size={size} />,
    dashboard: <RxDashboard size={size} />,
    flight: <PiAirplaneInFlight size={size} />,
    role: <BsDiagram2 size={size} />,
    seat: <PiSeat size={size} />,
    setting: <IoSettingsOutline size={size} />,
    ticket: <LiaTicketAltSolid size={size} />,
    edit: <EditOutlined />,
    search: <IoSearch size={16} />,
    plus: <PlusOutlined />,
    delete: <DeleteOutlined />,
    booking: <IoTicketOutline />,
    export: <PiExportBold />,
    report: <TbReportAnalytics />,
    google: <IoLogoGoogle size={16} />,
    profile: <CgProfile size={size} />
}
export default icons;
