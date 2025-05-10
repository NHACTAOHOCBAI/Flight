import { MdOutlineAccountCircle } from "react-icons/md";
import { FaPlane } from "react-icons/fa";
import { TbBuildingAirport, TbPlaneInflight } from "react-icons/tb";
import { IoPlanetSharp, IoSettingsOutline } from "react-icons/io5";
import { PiCity, PiSeat } from "react-icons/pi";
import { LuLayoutDashboard, LuTicket } from "react-icons/lu";
import { BsDiagram2 } from "react-icons/bs";

const size = 20;

const icons = {
    account: <MdOutlineAccountCircle size={size} />,
    plane: <FaPlane size={size} />,
    airline: <IoPlanetSharp size={size} />,
    airport: <TbBuildingAirport size={size} />,
    city: <PiCity size={size} />,
    dashboard: <LuLayoutDashboard size={size} />,
    flight: <TbPlaneInflight size={size} />,
    role: <BsDiagram2 size={size} />,
    seat: <PiSeat size={size} />,
    setting: <IoSettingsOutline size={size} />,
    ticket: <LuTicket size={size} />,
};

export default icons;
