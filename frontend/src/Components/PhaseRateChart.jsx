"use client";
import { useEffect, useState, useCallback } from "react";
import phaseService from "@/services/phase.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

const PhaseRateChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPhase, setSelectedPhase] = useState("");
  const [availablePhases, setAvailablePhases] = useState([]);
  const [allPhasesData, setAllPhasesData] = useState([]);

  // Get month name
  const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };

  // Get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Process data for the chart
  const processChartData = useCallback((phases, phaseName, month, year) => {
    if (!phases || phases.length === 0 || !phaseName) return [];

    // Filter data for selected phase, month and year
    const filteredData = phases.filter((phase) => {
      if (phase.phaseName !== phaseName) return false;
      
      const recordDate = phase.lastUpdated;
      if (!recordDate) return false;
      
      const date = new Date(recordDate);
      if (isNaN(date.getTime()) || date.getTime() === 0) return false;
      
      return date.getMonth() === month && date.getFullYear() === year;
    });

    // Get all days in the selected month
    const daysInMonth = getDaysInMonth(month, year);
    const chartDataArray = [];

    // Initialize all days with null values
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      chartDataArray.push({
        day: day,
        date: dateStr,
        pkr: null,
        usd: null,
        hasData: false,
        allocationCount: 0,
        affidavitCount: 0,
      });
    }

    // Fill in actual data
    filteredData.forEach((phase) => {
      const recordDate = phase.lastUpdated;
      if (!recordDate) return;

      const date = new Date(recordDate);
      if (isNaN(date.getTime()) || date.getTime() === 0) return;

      const day = date.getDate();
      const pkrValue = phase.ratePKR !== undefined ? Number(phase.ratePKR) : null;
      const usdValue = phase.rateUSD !== undefined ? Number(phase.rateUSD) : null;
      const category = phase.categoryType || "";

      if (day >= 1 && day <= daysInMonth) {
        const dataPoint = chartDataArray[day - 1];
        if (pkrValue !== null && !Number.isNaN(pkrValue)) {
          dataPoint.pkr = pkrValue;
        }
        if (usdValue !== null && !Number.isNaN(usdValue)) {
          dataPoint.usd = usdValue;
        }
        if (category.toLowerCase() === "allocation") {
          dataPoint.allocationCount += 1;
        } else if (category.toLowerCase() === "affidavit") {
          dataPoint.affidavitCount += 1;
        }
        const hasRates =
          (pkrValue !== null && !Number.isNaN(pkrValue)) ||
          (usdValue !== null && !Number.isNaN(usdValue));
        const hasCounts = dataPoint.allocationCount > 0 || dataPoint.affidavitCount > 0;
        dataPoint.hasData = hasRates || hasCounts;
      }
    });

    return chartDataArray;
  }, []);

  // Fetch all phases data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await phaseService.getAllPhases();
        if (res.success && res.data) {
          setAllPhasesData(res.data);
          
          // Extract unique phase names
          const uniquePhases = Array.from(
            new Set(res.data.map((phase) => phase.phaseName).filter(Boolean))
          );
          setAvailablePhases(uniquePhases);
          
          // Auto-select first phase if available
          if (uniquePhases.length > 0 && !selectedPhase) {
            setSelectedPhase(uniquePhases[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching phase data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process chart data when selection changes
  useEffect(() => {
    if (selectedPhase && allPhasesData.length > 0) {
      const processedData = processChartData(
        allPhasesData,
        selectedPhase,
        selectedMonth,
        selectedYear
      );
      setChartData(processedData);
    } else {
      setChartData([]);
    }
  }, [selectedPhase, selectedMonth, selectedYear, allPhasesData, processChartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = chartData.find(item => item.day === label);
      if (!dataPoint || !dataPoint.hasData) return null;

      const date = new Date(dataPoint.date);
      const displayDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-xl">
          <p className="text-sm font-semibold text-slate-800 mb-3 border-b border-gray-200 pb-2">
            {displayDate}
          </p>
          <div className="space-y-2">
            {dataPoint.pkr !== null && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-semibold">PKR:</span>{" "}
                  <span className="text-blue-600 font-bold">
                    {parseFloat(dataPoint.pkr).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>
            )}
            {dataPoint.usd !== null && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
                <p className="text-sm font-medium text-slate-700">
                  <span className="font-semibold">USD:</span>{" "}
                  <span className="text-green-600 font-bold">
                    {parseFloat(dataPoint.usd).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>
            )}
            {(dataPoint.allocationCount > 0 || dataPoint.affidavitCount > 0) && (
              <div className="pt-2 mt-2 border-t border-gray-200 space-y-2">
                {dataPoint.allocationCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-indigo-500"></div>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="font-semibold">Allocation entries:</span> {dataPoint.allocationCount}
                    </p>
                  </div>
                )}
                {dataPoint.affidavitCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500"></div>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="font-semibold">Affidavit entries:</span> {dataPoint.affidavitCount}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values for PKR
  const formatPKRAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Format Y-axis values for USD
  const formatUSDAxis = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-300 rounded-md p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (availablePhases.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-md p-8 text-center">
        <p className="text-gray-600">No phase data available</p>
      </div>
    );
  }

  const hasData = chartData.some(item => item.hasData);

  return (
    <div className="bg-white border border-gray-300 rounded-md p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Phase Rate Variations
        </h2>
        <p className="text-gray-600 text-sm">
          Monthly price trends with USD and PKR rates
        </p>
      </div>

      {/* Phase, Month and Year Selectors */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phase Name <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="w-full outline-none border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition"
          >
            <option value="">Select Phase</option>
            {availablePhases.map((phase) => (
              <option key={phase} value={phase}>
                {phase}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full outline-none border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {getMonthName(i)}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full outline-none border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {!selectedPhase ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-12 text-center">
          <p className="text-gray-600">Please select a phase to view the chart</p>
        </div>
      ) : !hasData ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-12 text-center">
          <p className="text-gray-600">
            No data available for {selectedPhase} in {getMonthName(selectedMonth)} {selectedYear}
          </p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <ResponsiveContainer width="100%" height={550}>
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id="pkrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="usdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                style={{ fontSize: "12px", fontWeight: "500" }}
                tick={{ fill: "#475569" }}
                label={{ 
                  value: "Day of Month", 
                  position: "insideBottom", 
                  offset: -10, 
                  style: { fill: "#475569", fontSize: "13px", fontWeight: "600" } 
                }}
                tickMargin={8}
              />
              <YAxis
                yAxisId="pkr"
                orientation="left"
                stroke="#3b82f6"
                style={{ fontSize: "12px", fontWeight: "500" }}
                tick={{ fill: "#3b82f6" }}
                tickFormatter={formatPKRAxis}
                tickMargin={8}
                label={{ 
                  value: "Rate (PKR)", 
                  angle: -90, 
                  position: "insideLeft", 
                  style: { fill: "#3b82f6", fontSize: "13px", fontWeight: "600" } 
                }}
                width={80}
              />
              <YAxis
                yAxisId="usd"
                orientation="right"
                stroke="#10b981"
                style={{ fontSize: "12px", fontWeight: "500" }}
                tick={{ fill: "#10b981" }}
                tickFormatter={formatUSDAxis}
                tickMargin={8}
                label={{ 
                  value: "Rate (USD)", 
                  angle: 90, 
                  position: "insideRight", 
                  style: { fill: "#10b981", fontSize: "13px", fontWeight: "600" } 
                }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="line"
                iconSize={16}
                formatter={(value) => (
                  <span style={{ color: "#475569", fontSize: "13px", fontWeight: "600" }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                yAxisId="pkr"
                dataKey="pkr"
                fill="url(#pkrGradient)"
                name="PKR"
                radius={[4, 4, 0, 0]}
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                yAxisId="usd"
                type="monotone"
                dataKey="usd"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                name="USD"
                strokeDasharray="0"
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Daily Entry Distribution by Category
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Compare how many Allocation vs Affidavit records were logged each day for the selected phase.
            </p>
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis
                  dataKey="day"
                  stroke="#475569"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tick={{ fill: "#475569" }}
                  label={{
                    value: "Day of Month",
                    position: "insideBottom",
                    offset: -10,
                    style: { fill: "#475569", fontSize: "13px", fontWeight: "600" },
                  }}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="count"
                  stroke="#334155"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  tick={{ fill: "#334155" }}
                  allowDecimals={false}
                  tickMargin={8}
                  label={{
                    value: "Number of Entries",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#334155", fontSize: "13px", fontWeight: "600" },
                  }}
                  width={90}
                  domain={[0, (dataMax) => Math.max(3, dataMax + 1)]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="square"
                  iconSize={16}
                  formatter={(value) => (
                    <span style={{ color: "#475569", fontSize: "13px", fontWeight: "600" }}>
                      {value}
                    </span>
                  )}
                />
                <Bar
                  yAxisId="count"
                  dataKey="allocationCount"
                  name="Allocation"
                  fill="#4f46e5"
                  barSize={24}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="count"
                  dataKey="affidavitCount"
                  name="Affidavit"
                  fill="#f59e0b"
                  barSize={24}
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {hasData && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <span>PKR (Bar Chart)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>USD (Line Chart)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-500"></div>
                <span>Allocation Entries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span>Affidavit Entries</span>
              </div>
              <div className="ml-auto text-slate-700">
                <span className="font-semibold">{selectedPhase}</span> - {getMonthName(selectedMonth)} {selectedYear}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PhaseRateChart;
