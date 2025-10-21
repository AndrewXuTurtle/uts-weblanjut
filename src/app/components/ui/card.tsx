"use client";

import React, { ReactNode } from 'react';

interface CardProps {
    title: string;
    children: ReactNode;
    hoverEffect?: boolean;
}

export function Card({ title, children, hoverEffect = true }: CardProps) {
    return (
        <div className={`border rounded -x1 border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg p-5 transition-all duration-300
            ${hoverEffect ? "hover:shadow-x1 hover:-translate-y-1" : ""}`}>
                <h2 className="text-x1 font-semibold text-black flex items-center">
                    <span className="w-1 h-5 bg-blue-400 rounded-full mr-2"></span>
                    {title}
                </h2>
                <div className="text-gray-600">
                    {children}
                </div>
        </div>
    );
}