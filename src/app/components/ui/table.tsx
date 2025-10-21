"use client";
import React from "react";

type TableProps = {
    columns: string[];
    data: {[key: string]: unknown}[];
}

export default function Table({ columns, data }: TableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-blue-400 text-white">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                                {col}
                            </th>
                        ))}
                    </tr>

                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50 transition-colors duration-200" : "bg-white"}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="py-4 px-6 text-sm text-gray-700 border-t border-gray-200">
                                    {String(row[col.toLowerCase()])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}