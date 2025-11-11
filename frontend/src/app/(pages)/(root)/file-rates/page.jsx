"use client";
import React, { useEffect, useMemo, useState } from "react";
import phaseService from "@/services/phase.service";
import Link from "next/link";
import { FiShare2, FiX, FiLink, FiCopy } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaMicrosoft } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { HiOutlineQrCode, HiOutlineUsers } from "react-icons/hi2";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateForURL(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

function formatCurrencyValue(value, currency) {
  if (value === null || value === undefined || value === "") return "N/A";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "N/A";
  const formattedRate = numericValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formattedRate}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function Section({ phaseName, records, onShare, onToggleTrend, isExpanded, trendData }) {
  const sectionId = useMemo(() => slugify(phaseName || ""), [phaseName]);
  const hasTrendData = useMemo(() => hasTrendValues(trendData), [trendData]);
  const [activeCurrency, setActiveCurrency] = useState("PKR");

  useEffect(() => {
    if (!isExpanded) {
      setActiveCurrency("PKR");
    }
  }, [isExpanded]);

  const trendSummary = useMemo(() => {
    const key = activeCurrency === "PKR" ? "ratePKR" : "rateUSD";
    return calculateTrendSummary(trendData, key);
  }, [trendData, activeCurrency]);

  return (
    <section id={sectionId} className="mb-8 bg-white border rounded shadow overflow-hidden">
      <div className="px-5 py-4 border-b bg-blue-900 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">{phaseName}</h2>
            {hasTrendData && (
              <p className="text-xs text-blue-100/80">30-day performance preview</p>
            )}
          </div>
          {hasTrendData && (
            <div className="hidden md:flex items-center gap-3 md:pl-6">
              <MiniSparkline data={trendData} gradientId={`${sectionId}-spark`} />
              <span className="text-xs font-medium uppercase tracking-widest text-blue-100/70">Trend</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasTrendData && (
            <button
              type="button"
              onClick={onToggleTrend}
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              {isExpanded ? "Hide Trend" : "View Trend"}
            </button>
          )}
          <button
            type="button"
            onClick={() => onShare({ phaseName, sectionId })}
            className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <FiShare2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-gray-500">No records available for this phase.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm text-gray-700 border-b">Description</th>
                <th className="p-3 text-sm text-gray-700 border-b">Category</th>
                <th className="p-3 text-sm text-gray-700 border-b">Property Type</th>
                <th className="p-3 text-sm text-gray-700 border-b">Rate (PKR)</th>
                <th className="p-3 text-sm text-gray-700 border-b">Rate (USD)</th>
                <th className="p-3 text-sm text-gray-700 border-b">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr
                  key={record._id || index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3 border-b text-sm text-gray-700">
                    {record.description}
                  </td>
                  <td className="p-3 border-b text-sm text-gray-700">
                    {record.categoryType || "Allocation"}
                  </td>
                  <td className="p-3 border-b text-sm text-gray-700">
                    {record.propertyType || "Residential"}
                  </td>
                  <td className="p-3 border-b text-sm font-semibold text-gray-800">
                    {formatCurrencyValue(record.ratePKR ?? record.rate, "PKR")}
                  </td>
                  <td className="p-3 border-b text-sm font-semibold text-gray-800">
                    {formatCurrencyValue(record.rateUSD, "USD")}
                  </td>
                  <td className="p-3 border-b text-sm text-gray-500">
                    {formatDate(record.lastUpdated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isExpanded && hasTrendData && (
        <div className="border-t border-blue-50 bg-slate-50/60">
          <div className="px-5 py-6 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <TrendSummary summary={trendSummary} currency={activeCurrency} />
              <div className="flex items-center gap-2">
                {["PKR", "USD"].map((currency) => (
                  <button
                    key={currency}
                    type="button"
                    onClick={() => setActiveCurrency(currency)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      activeCurrency === currency
                        ? "bg-blue-900 text-white focus:ring-blue-200"
                        : "bg-white text-slate-600 hover:bg-slate-100 focus:ring-blue-100"
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <TrendChart data={trendData} currency={activeCurrency} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SharePlatform({ name, href, icon: Icon, iconColor, iconBgColor }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:scale-105 active:scale-95"
    >
      <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${iconBgColor || "bg-slate-100"}`}>
        <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconColor || "text-slate-700"}`} />
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-slate-700 text-center leading-tight">{name}</span>
    </a>
  );
}

function ShareModal({ phaseName, shareUrl, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sharePlatforms = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${phaseName} - ${shareUrl}`)}`,
      icon: FaWhatsapp,
      iconBgColor: "bg-[#25d366]",
      iconColor: "text-white",
    },
    {
      name: "Mail",
      href: `mailto:?subject=${encodeURIComponent(phaseName)}&body=${encodeURIComponent(shareUrl)}`,
      icon: FaEnvelope,
      iconBgColor: "bg-blue-500",
      iconColor: "text-white",
    },
    {
      name: "Outlook",
      href: `https://outlook.live.com/owa/?path=/mail/action/compose&subject=${encodeURIComponent(phaseName)}&body=${encodeURIComponent(shareUrl)}`,
      icon: FaMicrosoft,
      iconBgColor: "bg-[#0078d4]",
      iconColor: "text-white",
    },
    {
      name: "Microsoft Teams",
      href: `https://teams.microsoft.com/share?href=${encodeURIComponent(shareUrl)}`,
      icon: HiOutlineUsers,
      iconBgColor: "bg-[#6264a7]",
      iconColor: "text-white",
    },
    {
      name: "Gmail",
      href: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(phaseName)}&body=${encodeURIComponent(shareUrl)}`,
      icon: SiGmail,
      iconBgColor: "bg-[#ea4335]",
      iconColor: "text-white",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: FaFacebookF,
      iconBgColor: "bg-[#1877f2]",
      iconColor: "text-white",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(phaseName)}`,
      icon: FaTwitter,
      iconBgColor: "bg-[#1d9bf0]",
      iconColor: "text-white",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: FaLinkedinIn,
      iconBgColor: "bg-[#0a66c2]",
      iconColor: "text-white",
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-6 transition-opacity duration-200" 
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 sm:mb-3">{phaseName}</h2>
              <div className="flex items-center gap-2 rounded-lg sm:rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm">
                <FiLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 truncate flex-1 font-medium">{shareUrl}</span>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
                    title="Copy link"
                  >
                    <FiCopy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
                    title="More options"
                  >
                    <HiOutlineQrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
              {copied && (
                <div className="mt-1.5 sm:mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                  <span>✓</span>
                  <span>Link copied to clipboard</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              aria-label="Close"
            >
              <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Share Platforms Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-4 sm:mb-5 uppercase tracking-wider">Share using</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
            {sharePlatforms.map((platform) => (
              <SharePlatform
                key={platform.name}
                name={platform.name}
                href={platform.href}
                icon={platform.icon}
                iconBgColor={platform.iconBgColor}
                iconColor={platform.iconColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function hasTrendValues(data = []) {
  return data?.some((item) => {
    if (!item) return false;
    const pkr = normalizeNumber(item.ratePKR ?? item.rate);
    const usd = normalizeNumber(item.rateUSD);
    return pkr !== null || usd !== null;
  });
}

function calculateTrendSummary(data = [], key) {
  const filtered = data.filter((item) => item && item[key] !== null && !Number.isNaN(item[key]));

  if (!filtered.length) {
    return {
      high: null,
      low: null,
      change: null,
      changePercent: null,
      latest: null,
      initial: null,
    };
  }

  const values = filtered.map((item) => Number(item[key]));
  const high = Math.max(...values);
  const low = Math.min(...values);
  const initial = Number(filtered[0][key]);
  const latest = Number(filtered[filtered.length - 1][key]);
  const change = latest - initial;
  const changePercent = initial !== 0 ? (change / initial) * 100 : null;

  return {
    high,
    low,
    change,
    changePercent,
    latest,
    initial,
  };
}

function normalizeNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

function buildTrendDataMap(records = []) {
  if (!records?.length) return {};

  const grouped = records.reduce((acc, record) => {
    const name = record?.phaseName;
    if (!name) return acc;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(record);
    return acc;
  }, {});

  const result = {};
  Object.entries(grouped).forEach(([name, list]) => {
    result[name] = buildTrendSeries(list);
  });
  return result;
}

function buildTrendSeries(records = []) {
  if (!records?.length) return [];

  const sorted = records
    .filter((record) => record?.lastUpdated)
    .sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));

  if (!sorted.length) return [];

  const latestByDate = new Map();
  sorted.forEach((record) => {
    const date = new Date(record.lastUpdated);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toISOString().split("T")[0];
    const existing = latestByDate.get(key);
    const existingDate = existing ? new Date(existing.updatedAt || existing.lastUpdated) : null;
    const currentDate = new Date(record.updatedAt || record.lastUpdated);

    if (!existing || (existingDate && currentDate > existingDate)) {
      latestByDate.set(key, record);
    }
  });

  const latestRecord = sorted[sorted.length - 1];
  const latestDate = new Date(latestRecord.lastUpdated);
  if (Number.isNaN(latestDate.getTime())) return [];

  const year = latestDate.getFullYear();
  const month = latestDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const series = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month, day);
    const key = current.toISOString().split("T")[0];
    const record = latestByDate.get(key);

    const ratePKR = record ? normalizeNumber(record.ratePKR ?? record.rate) : null;
    const rateUSD = record ? normalizeNumber(record.rateUSD) : null;

    series.push({
      dateKey: key,
      label: current.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      dayLabel: `Day ${day}`,
      day,
      ratePKR,
      rateUSD,
    });
  }

  return series;
}

function MiniSparkline({ data, gradientId }) {
  const sanitized = useMemo(
    () =>
      (data || [])
        .map((item) => ({
          label: item?.label,
          value: normalizeNumber(item?.ratePKR ?? item?.rate),
        }))
        .filter((item) => item.value !== null),
    [data]
  );

  if (sanitized.length < 2) {
    return null;
  }

  return (
    <div className="h-12 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sanitized}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke="#bfdbfe" fill={`url(#${gradientId})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function TrendSummary({ summary, currency }) {
  const currencyLabel = currency || "PKR";

  const latestText = summary?.latest !== null ? formatCurrencyValue(summary.latest, currencyLabel) : "N/A";
  const highText = summary?.high !== null ? formatCurrencyValue(summary.high, currencyLabel) : "N/A";
  const lowText = summary?.low !== null ? formatCurrencyValue(summary.low, currencyLabel) : "N/A";

  const changeValue = summary?.change;
  const changePercent = summary?.changePercent;
  const isPositive = changeValue > 0;
  const isNegative = changeValue < 0;

  const changeText = changeValue !== null
    ? `${isPositive ? "+" : isNegative ? "-" : ""}${formatCurrencyValue(Math.abs(changeValue), currencyLabel)}`
    : "N/A";

  const percentText = changePercent !== null
    ? `${isPositive ? "+" : isNegative ? "-" : ""}${Math.abs(changePercent).toFixed(2)}%`
    : "";

  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700/70">Latest</p>
        <p className="mt-1 text-lg font-semibold text-blue-900">{latestText}</p>
        <p className="text-[11px] font-medium uppercase tracking-widest text-blue-700/60 mt-1">{currencyLabel}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">30-day Range</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">High: {highText}</p>
        <p className="text-sm font-semibold text-slate-800">Low: {lowText}</p>
      </div>
      <div className={`rounded-2xl px-4 py-3 shadow-sm border ${
        isPositive ? "border-emerald-200 bg-emerald-50" : isNegative ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"
      }`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Change vs Start</p>
        <p className={`mt-1 text-lg font-semibold ${
          isPositive ? "text-emerald-600" : isNegative ? "text-rose-600" : "text-slate-700"
        }`}>
          {changeText}
        </p>
        {percentText && (
          <p className={`text-sm font-medium ${
            isPositive ? "text-emerald-500" : isNegative ? "text-rose-500" : "text-slate-500"
          }`}>
            {percentText}
          </p>
        )}
      </div>
    </div>
  );
}

function TrendChart({ data, currency }) {
  const valueKey = currency === "USD" ? "rateUSD" : "ratePKR";
  const color = currency === "USD" ? "#059669" : "#2563eb";
  const gradientId = currency === "USD" ? "usdLineFill" : "pkrLineFill";

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="day"
          stroke="#475569"
          style={{ fontSize: "11px", fontWeight: 500 }}
          tick={{ fill: "#475569" }}
          tickLine={false}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={50}
        />
        <YAxis
          stroke="#475569"
          style={{ fontSize: "12px", fontWeight: 500 }}
          tick={{ fill: "#475569" }}
          tickFormatter={formatAxisTick}
          allowDecimals={false}
          width={70}
        />
        <Tooltip content={<TrendTooltip currency={currency} />} cursor={{ stroke: color, strokeDasharray: "3 3" }} />
        <Area
          type="monotone"
          dataKey={valueKey}
          fill={`url(#${gradientId})`}
          stroke="none"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey={valueKey}
          stroke={color}
          strokeWidth={3}
          dot={{ r: 3, fill: color, stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function TrendTooltip({ active, payload, label, currency }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const point = payload[0]?.payload;
  const value = payload[0]?.value;
  if (!point || value === undefined || value === null) {
    return null;
  }

  const fullDate = point?.dateKey
    ? new Date(point.dateKey).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : label;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{currency}</p>
      <p className="text-sm font-semibold text-slate-800">{formatCurrencyValue(value, currency)}</p>
      <p className="mt-1 text-xs text-slate-500">{fullDate}</p>
    </div>
  );
}

function formatAxisTick(value) {
  if (value === null || value === undefined) return "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return value.toString();
}

export default function FileRatesPage() {
  const [newPhasesData, setNewPhasesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalDates, setHistoricalDates] = useState([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePayload, setSharePayload] = useState({ phaseName: "", sectionId: "" });
  const [shareUrl, setShareUrl] = useState("");
  const [allPhaseRecords, setAllPhaseRecords] = useState([]);
  const [expandedPhase, setExpandedPhase] = useState(null);

  const trendDataByPhase = useMemo(() => buildTrendDataMap(allPhaseRecords), [allPhaseRecords]);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        setLoading(true);
        const res = await phaseService.getAllPhases();
        
        if (res.success && res.data) {
          const publishedRecords = res.data.filter((record) => record.isPublished);
          setAllPhaseRecords(publishedRecords);

          // Filter only new records among published ones
          const newRecords = publishedRecords.filter(
            (record) => record.status === "new"
          );

          // Collect all unique dates from published records (for historical navigation)
          const datesSet = new Set();
          publishedRecords.forEach((record) => {
            if (record.lastUpdated) {
              const dateStr = formatDateForURL(record.lastUpdated);
              if (dateStr) {
                datesSet.add(dateStr);
              }
            }
          });

          // Group new records by phaseName
          const newGrouped = {};
          newRecords.forEach((record) => {
            const name = record.phaseName;
            if (!name) return;
            if (!newGrouped[name]) {
              newGrouped[name] = [];
            }
            newGrouped[name].push(record);
          });

          // Convert grouped object to array sorted by latest update
          const newPhasesArray = Object.entries(newGrouped).map(([name, phaseRecords]) => ({
            phaseName: name,
            records: phaseRecords.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)),
          }));

          setNewPhasesData(newPhasesArray);
          setHistoricalDates(Array.from(datesSet).sort().reverse());
        } else {
          setError(res.message || "Failed to fetch phase data");
        }
      } catch (err) {
        console.error("Error fetching phases:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            <p className="mt-4 text-gray-600">Loading file rates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">Error loading data</p>
            <p className="text-red-600 text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            DHA Lahore File Rates
          </h1>
          <p className="text-gray-600 mt-2">
            Residential & Commercial Plots latest prices
          </p>
        </header>

        <main>
          {/* New Status Records */}
          {newPhasesData.length === 0 ? (
            <div className="bg-white border rounded shadow p-8 text-center">
              <p className="text-gray-500">No phase data available at this time.</p>
            </div>
          ) : (
            <>
              {newPhasesData.map((phaseData) => {
                const trendData = trendDataByPhase[phaseData.phaseName] || [];
                const isExpanded = expandedPhase === phaseData.phaseName;

                return (
                  <Section
                    key={phaseData.phaseName}
                    phaseName={phaseData.phaseName}
                    records={phaseData.records}
                    trendData={trendData}
                    isExpanded={isExpanded}
                    onToggleTrend={() =>
                      setExpandedPhase((prev) =>
                        prev === phaseData.phaseName ? null : phaseData.phaseName
                      )
                    }
                    onShare={({ phaseName, sectionId }) => {
                      const url = typeof window !== "undefined"
                        ? `${window.location.origin}/file-rates#${sectionId}`
                        : `https://dha-connect.vercel.app/file-rates#${sectionId}`;
                      setSharePayload({ phaseName, sectionId });
                      setShareUrl(url);
                      setShareModalOpen(true);
                    }}
                  />
                );
              })}

              {/* Historical Dates Navigation */}
              {historicalDates.length > 0 && (
                <section className="mt-8 bg-white border rounded shadow">
                  <div className="px-5 py-4 border-b bg-blue-900">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      View Historical Data by Date
                    </h2>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 mb-4">
                      Click on any date below to view all phases data for that date:
                    </p>
                    <div className="space-y-2">
                      {historicalDates.map((dateStr) => {
                        const isToday = 
                          formatDateForURL(new Date().toISOString()) === dateStr;
                        return (
                          <Link
                            key={dateStr}
                            href={`/file-rates/${dateStr}`}
                            className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-900 group-hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-900">
                                {formatDate(dateStr)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {isToday ? "Today's data" : "Historical data"}
                              </p>
                            </div>
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-blue-900 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
      {shareModalOpen && (
        <ShareModal
          phaseName={sharePayload.phaseName}
          shareUrl={shareUrl}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </div>
  );
}
