import { MdOutlineDelete } from "react-icons/md";
import { IoPlanetOutline, IoSearch, IoSettingsOutline } from "react-icons/io5";
import { PiAirplaneInFlight, PiCityLight, PiSeat } from "react-icons/pi";
import { LuPlane, LuTicket } from "react-icons/lu";
import { BsDiagram2 } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { GoLocation } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
const size = 20;

const icons = {
    account: <VscAccount size={size} />,
    plane: <LuPlane size={size} />,
    airline: <IoPlanetOutline size={size} />,
    airport: <GoLocation size={size} />,
    city: <PiCityLight size={size} />,
    dashboard: <RxDashboard size={size} />,
    flight: <PiAirplaneInFlight size={size} />,
    role: <BsDiagram2 size={size} />,
    seat: <PiSeat size={size} />,
    setting: <IoSettingsOutline size={size} />,
    ticket: <LuTicket size={size} />,
    edit: <FiEdit size={size} />,
    delete: <MdOutlineDelete size={size} />,
    search: <IoSearch size={16} />,
};

export default icons;
