import { MdOutlineAccountCircle, MdOutlineDelete } from "react-icons/md";
import { TbBuildingAirport, TbPlaneInflight } from "react-icons/tb";
import { IoPlanetOutline, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { PiCity, PiSeat } from "react-icons/pi";
import { LuLayoutDashboard, LuPlane, LuTicket } from "react-icons/lu";
import { BsDiagram2 } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

const size = 20;

const icons = {
    account: <MdOutlineAccountCircle size={size} />,
    plane: <LuPlane size={size} />,
    airline: <IoPlanetOutline size={size} />,
    airport: <TbBuildingAirport size={size} />,
    city: <PiCity size={size} />,
    dashboard: <LuLayoutDashboard size={size} />,
    flight: <TbPlaneInflight size={size} />,
    role: <BsDiagram2 size={size} />,
    seat: <PiSeat size={size} />,
    setting: <IoSettingsOutline size={size} />,
    ticket: <LuTicket size={size} />,
    edit: <FiEdit size={size} />,
    delete: <MdOutlineDelete size={size} />,
    search: <IoSearch size={16} />
};

export default icons;
