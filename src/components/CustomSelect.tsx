import React, { useState, useRef, useEffect } from "react";

type Item = {
    label: string;
    value: number;
};

type Props = {
    items: Item[];
    onChange: (item: Item) => void;
    selected?: Item;
};

const CustomSelect: React.FC<Props> = ({ items, onChange, selected }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const rows = 5;
    const cols = Math.ceil(items.length / rows);

    // Auto-close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left w-64" ref={dropdownRef}>
            <button
                className="w-full border px-4 py-2 rounded bg-white shadow hover:bg-gray-50 transition"
                onClick={() => setOpen(!open)}
            >
                {selected ? selected.label : "Select an item"}
            </button>

            <div
                className={`absolute z-10 mt-2 w-full bg-white border rounded shadow p-2 transition-all duration-300 ease-in-out transform ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <div
                    className={`grid gap-2`}
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        gridAutoRows: "minmax(40px, auto)",
                    }}
                >
                    {items.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => {
                                onChange(item);
                                setOpen(false);
                            }}
                            className="border rounded px-2 py-1 hover:bg-blue-100 transition"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomSelect;
