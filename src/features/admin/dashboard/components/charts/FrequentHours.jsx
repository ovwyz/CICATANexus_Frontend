"use client";
import { apiFetch } from "@/utils/apiFetch";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../cards/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./Chart";
import { Icon } from "@iconify/react";
import useDateNavigation, { getPeriodLabel, getEnglishDayName } from "@/utils/dateNavigation";
import { useState, useEffect } from "react";

export const description = "A simple area chart";

const chartConfig = {
    requests: {
        label: "Solicitudes",
        color: "var(--color-primary-green)",
    },
};

export default function FrequentHours() {
    const {
        currentDay,
        currentMonth,
        currentYear,
        handleLeftClick,
        handleRightClick,
        handleDayLeft,
        handleDayRight,
        handleYearLeft,
        handleYearRight,
        isLeftDisabled,
        isRightDisabled,
    } = useDateNavigation();

    const [chartData, setChartData] = useState([]);

    const { label: monthLabel, dayLabel } = getPeriodLabel(
        0,
        currentMonth,
        currentYear,
        currentDay
    );

    useEffect(() => {
        const fetchData = async () => {
            const englishDay = getEnglishDayName(currentDay);
            const url = `/analytics/hourly-frequency?month=${currentMonth}&dayString=${englishDay}&year=${currentYear}`;

            try {
                const data = await apiFetch(url);

                const fixedHours = [
                    "08:00", "09:00", "10:00", "11:00", "12:00",
                    "13:00", "14:00", "15:00", "16:00"
                ];

                const formatted = fixedHours.map((hour) => {
                    const match = data.find((item) => item.hour === hour);
                    return {
                        hour,
                        requests: match ? match.count : 0,
                    };
                });

                setChartData(formatted);
            } catch (error) {
                console.error("Error al cargar datos de horarios frecuentes", error);
            }
        };

        fetchData();
    }, [currentMonth, currentYear, dayLabel]);

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-base font-semibold font-poppins leading-none">
                    Horarios más frecuentes
                </CardTitle>
            </CardHeader>
            {chartData.every((d) => d.requests === 0) ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-gray-500 font-montserrat text-xl font-semibold text-center">
                        No hay solicitudes registradas
                    </div>
                </div>
            ) : (
                <CardContent className="flex justify-center items-center h-[110px]">
                    <ChartContainer
                        config={chartConfig}
                        className="h-[150px] w-full"
                    >
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 14,
                                right: 12,
                                top: 5,
                            }}
                        >
                            <CartesianGrid vertical={false} stroke="#d1d1d1" />
                            <XAxis
                                dataKey="hour"
                                interval={0}
                                padding={{ left: 3, right: 3 }}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={({ x, y, payload }) => (
                                    <text
                                        x={x}
                                        y={y + 10}
                                        textAnchor="middle"
                                        fontSize={12}
                                        fontFamily="var(--font-montserrat)"
                                        fontWeight={500}
                                        fill="#374151"
                                    >
                                        {payload.value}
                                    </text>
                                )}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <defs>
                                <linearGradient
                                    id="greenGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--color-primary-green)"
                                        stopOpacity={0.9}
                                    />
                                    <stop
                                        offset="75%"
                                        stopColor="#B3D7CD"
                                        stopOpacity={0.6}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#ffffff"
                                        stopOpacity={0.3}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="requests"
                                type="monotone"
                                fill="url(#greenGradient)"
                                fillOpacity={0.4}
                                stroke="var(--color-primary-green)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            )}
            <CardFooter className="flex-col items-center text-sm">
                <div className="flex justify-center items-center gap-6 mt-2 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                        <Icon
                            icon="iconamoon:arrow-left-2-light"
                            className="h-4 w-4 cursor-pointer text-blue-600"
                            onClick={handleYearLeft}
                        />
                        <span className="font-montserrat font-medium">{currentYear}</span>
                        <Icon
                            icon="iconamoon:arrow-right-2-light"
                            className="h-4 w-4 cursor-pointer text-blue-600"
                            onClick={handleYearRight}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon
                            icon="iconamoon:arrow-left-2-light"
                            className={`h-4 w-4 ${isLeftDisabled
                                ? "text-gray-400"
                                : "text-blue-600 cursor-pointer"}`}
                            onClick={!isLeftDisabled ? handleLeftClick : undefined}
                        />
                        <span className="font-montserrat font-medium">{monthLabel}</span>
                        <Icon
                            icon="iconamoon:arrow-right-2-light"
                            className={`h-4 w-4 ${isRightDisabled
                                ? "text-gray-400"
                                : "text-blue-600 cursor-pointer"}`}
                            onClick={!isRightDisabled ? handleRightClick : undefined}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon
                            icon="iconamoon:arrow-left-2-light"
                            className="h-4 w-4 cursor-pointer text-blue-600"
                            onClick={handleDayLeft}
                        />
                        <span className="font-montserrat font-medium">{dayLabel}</span>
                        <Icon
                            icon="iconamoon:arrow-right-2-light"
                            className="h-4 w-4 cursor-pointer text-blue-600"
                            onClick={handleDayRight}
                        />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
