// src/components/dashboard/ChartPalette.tsx
import React from 'react';
import { BarChart3, LineChart, PieChart } from 'lucide-react'; // You'll need to install this package

const ChartPalette = () => {
    // onDragStart handler to set data for the dropped item
    const onDragStart = (e: React.DragEvent<HTMLDivElement>, chartType: string) => {
        e.dataTransfer.setData("chartType", chartType);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Chart Gallery</h3>
            
            {/* Draggable Bar Chart */}
            <div
                className="bg-gray-700 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing flex items-center space-x-3"
                draggable
                onDragStart={(e) => onDragStart(e, "bar")}
            >
                <BarChart3 className="w-6 h-6 text-indigo-400" />
                <span className="text-white text-lg font-semibold">Bar Chart</span>
            </div>

            {/* Draggable Line Chart */}
            <div
                className="bg-gray-700 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing flex items-center space-x-3"
                draggable
                onDragStart={(e) => onDragStart(e, "line")}
            >
                <LineChart className="w-6 h-6 text-teal-400" />
                <span className="text-white text-lg font-semibold">Line Chart</span>
            </div>
            
            {/* Draggable Pie Chart */}
            <div
                className="bg-gray-700 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing flex items-center space-x-3"
                draggable
                onDragStart={(e) => onDragStart(e, "pie")}
            >
                <PieChart className="w-6 h-6 text-yellow-400" />
                <span className="text-white text-lg font-semibold">Pie Chart</span>
            </div>
        </div>
    );
};

export default ChartPalette;