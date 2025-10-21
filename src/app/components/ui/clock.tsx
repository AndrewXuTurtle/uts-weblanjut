"use client";

import { useState, useEffect } from "react";

type ClockProps = {
    format?: "12h" | "24h" | "date" | "datetime" | "time-only";
    timezone?: string;
    className?: string;
    showSeconds?: boolean;
    showDate?: boolean;
    variant?: "digital" | "analog" | "minimal";
};

export function Clock({
    format = "12h",
    timezone = "Asia/Jakarta",
    className = "",
    showSeconds = true,
    showDate = false,
    variant = "digital"
}: ClockProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
            hour12: format === "12h",
            hour: "2-digit",
            minute: "2-digit",
            ...(showSeconds && { second: "2-digit" }),
        };

        switch (format) {
            case "date":
                return date.toLocaleDateString("id-ID", {
                    timeZone: timezone,
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
            case "datetime":
                return date.toLocaleString("id-ID", {
                    timeZone: timezone,
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    ...(showSeconds && { second: "2-digit" }),
                    hour12: true
                });
            case "time-only":
            case "12h":
            case "24h":
            default:
                return date.toLocaleTimeString("id-ID", options);
        }
    };

    const getDateString = (date: Date) => {
        return date.toLocaleDateString("id-ID", {
            timeZone: timezone,
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (variant === "analog") {
        const seconds = time.getSeconds();
        const minutes = time.getMinutes();
        const hours = time.getHours() % 12;

        const secondAngle = (seconds * 6) - 90;
        const minuteAngle = (minutes * 6) - 90;
        const hourAngle = (hours * 30 + minutes * 0.5) - 90;

        return (
            <div className={`flex flex-col items-center ${className}`}>
                <div className="relative w-32 h-32 rounded-full border-4 border-gray-300 bg-white shadow-lg">
                    {/* Hour markers */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-6 bg-gray-600"
                            style={{
                                top: "8px",
                                left: "50%",
                                transformOrigin: "50% 56px",
                                transform: `translateX(-50%) rotate(${i * 30}deg)`
                            }}
                        />
                    ))}
                    
                    {/* Hour hand */}
                    <div
                        className="absolute w-1 h-8 bg-black rounded-full"
                        style={{
                            top: "32px",
                            left: "50%",
                            transformOrigin: "50% 32px",
                            transform: `translateX(-50%) rotate(${hourAngle}deg)`
                        }}
                    />
                    
                    {/* Minute hand */}
                    <div
                        className="absolute w-0.5 h-12 bg-black rounded-full"
                        style={{
                            top: "16px",
                            left: "50%",
                            transformOrigin: "50% 48px",
                            transform: `translateX(-50%) rotate(${minuteAngle}deg)`
                        }}
                    />
                    
                    {/* Second hand */}
                    {showSeconds && (
                        <div
                            className="absolute w-0.5 h-14 bg-red-500 rounded-full"
                            style={{
                                top: "8px",
                                left: "50%",
                                transformOrigin: "50% 56px",
                                transform: `translateX(-50%) rotate(${secondAngle}deg)`
                            }}
                        />
                    )}
                    
                    {/* Center dot */}
                    <div className="absolute w-3 h-3 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                {showDate && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        {getDateString(time)}
                    </div>
                )}
            </div>
        );
    }

    if (variant === "minimal") {
        return (
            <div className={`text-center ${className}`}>
                <div className="font-mono text-2xl font-bold text-gray-800">
                    {formatTime(time)}
                </div>
                {showDate && (
                    <div className="text-sm text-gray-500 mt-1">
                        {getDateString(time)}
                    </div>
                )}
            </div>
        );
    }

    // Default digital variant
    return (
        <div className={`bg-gray-900 text-green-400 p-4 rounded-lg font-mono shadow-lg ${className}`}>
            <div className="text-center">
                <div className="text-3xl font-bold tracking-wider">
                    {formatTime(time)}
                </div>
                {showDate && (
                    <div className="text-sm mt-2 text-green-300">
                        {getDateString(time)}
                    </div>
                )}
                <div className="text-xs text-green-200 mt-1">
                    {timezone}
                </div>
            </div>
        </div>
    );
}