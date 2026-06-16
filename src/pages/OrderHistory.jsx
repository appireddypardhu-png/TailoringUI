import { useEffect, useState } from "react";
import { Select, Button, Spin, Empty } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import API from "../services/api";

export default function OrderHistory() {
    const [filterType, setFilterType] = useState("monthly");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const months = [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 },
    ];

    // Generate year options (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => ({
        label: (currentYear - 5 + i).toString(),
        value: currentYear - 5 + i,
    }));

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            let url;
            
            if (filterType === "yearly") {
                url = `/orders/year/${year}`;
            } else {
                url = `/orders/year/${year}/month/${month}`;
            }

            const res = await API.get(url);
            let orderData = res.data || [];
            
            // Ensure orderData is an array
            if (!Array.isArray(orderData)) {
                orderData = orderData.orders || orderData.data || [];
            }
            
            setOrders(Array.isArray(orderData) ? orderData : []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders when filter type, year, or month changes
    useEffect(() => {
        fetchOrders();
    }, [filterType, year, month]);

    const calculateTotal = () => {
        return orders.reduce((sum, order) => sum + (parseFloat(order.orderprice || order.price || 0) || 0), 0);
    };

    const downloadExcel = () => {
        if (orders.length === 0) {
            alert("No orders to download");
            return;
        }

        const dataToExport = orders.map((order) => ({
            "Order ID": order.orderid || order.id || "-",
            "Customer Name": order.customerName || order.cname || order.customer || "-",
            "Phone": order.customerPhone || order.cphone || "-",
            "Order Date": (order.orderdate || order.date || "-").split("T")[0],
            "Amount": order.orderprice || order.price || "-",
            "Status": order.orderStatus || order.status || "PENDING",
        }));

        // Add total row
        dataToExport.push({
            "Order ID": "",
            "Customer Name": "",
            "Phone": "",
            "Order Date": "TOTAL",
            "Amount": calculateTotal(),
            "Status": "",
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Order History");

        // Auto-size columns
        const colWidths = [
            { wch: 12 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 12 },
            { wch: 12 },
        ];
        worksheet["!cols"] = colWidths;

        const fileName = filterType === "yearly" 
            ? `Order_History_${year}.xlsx`
            : `Order_History_${year}_Month_${month}.xlsx`;

        XLSX.writeFile(workbook, fileName);
    };

    const displayOrders = orders.slice(0, 10);
    const hasMoreRecords = orders.length > 10;

    return (
        <div className="min-h-screen bg-[#FFF2E1] p-4 sm:p-8">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-[#A79277] text-white p-4 sm:p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Order History</h2>
                    
                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Filter Type Selector */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Filter Type</label>
                            <Select
                                value={filterType}
                                onChange={setFilterType}
                                options={[
                                    { label: "Yearly", value: "yearly" },
                                    { label: "Monthly", value: "monthly" },
                                ]}
                                className="w-full"
                            />
                        </div>

                        {/* Year Selector */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Year</label>
                            <Select
                                value={year}
                                onChange={setYear}
                                options={yearOptions}
                                className="w-full"
                            />
                        </div>

                        {/* Month Selector (only visible in monthly mode) */}
                        {filterType === "monthly" && (
                            <div>
                                <label className="block text-sm font-semibold mb-2">Month</label>
                                <Select
                                    value={month}
                                    onChange={setMonth}
                                    options={months}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {/* Download Button */}
                        <div className="flex items-end">
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={downloadExcel}
                                disabled={loading || orders.length === 0}
                                className="w-full h-10 bg-white text-[#A79277] hover:!bg-gray-100 font-semibold"
                            >
                                Download Excel
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <Spin size="large" tip="Loading orders..." />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && orders.length === 0 && (
                        <Empty
                            description="No orders found"
                            style={{ marginTop: 60, marginBottom: 60 }}
                        />
                    )}

                    {!loading && !error && orders.length > 0 && (
                        <>
                            {/* Table with scrollable area for more than 10 records */}
                            <div className="overflow-x-auto mb-6">
                                <div className={hasMoreRecords ? "max-h-[500px] overflow-y-auto" : ""}>
                                    <table className="w-full min-w-[700px]">
                                        <thead className="bg-[#EFE6DD] sticky top-0">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-[#3B3A3A]">Order ID</th>
                                                <th className="text-left p-4 font-semibold text-[#3B3A3A]">Customer Name</th>
                                                <th className="text-left p-4 font-semibold text-[#3B3A3A]">Phone</th>
                                                <th className="text-left p-4 font-semibold text-[#3B3A3A]">Order Date</th>
                                                <th className="text-left p-4 font-semibold text-[#3B3A3A]">Amount</th>
                                                <th className="text-left p-4 font-semibold text-[#3B3A3A]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayOrders.map((order, index) => {
                                                const id = order.orderid ?? order.id ?? order.orderId;
                                                const status = order.orderStatus || order.status || "PENDING";
                                                const isPending = status.toUpperCase() === "PENDING";
                                                const amount = order.orderprice ?? order.amount ?? order.price ?? "-";
                                                const date = order.orderdate ?? order.date ?? "-";
                                                const custName = order.customerName ?? order.cname ?? order.customer ?? "-";
                                                const custPhone = order.customerPhone ?? order.cphone ?? order.customerPhone ?? "-";

                                                return (
                                                    <tr
                                                        key={id || index}
                                                        className="border-b hover:bg-[#FAF7F0] transition"
                                                    >
                                                        <td className="p-4 text-[#3B3A3A]">{id}</td>
                                                        <td className="p-4 text-[#3B3A3A]">{custName}</td>
                                                        <td className="p-4 text-[#3B3A3A]">{custPhone}</td>
                                                        <td className="p-4 text-[#3B3A3A]">{(date + "").split("T")[0]}</td>
                                                        <td className="p-4 text-[#3B3A3A] font-semibold">₹{amount}</td>
                                                        <td className="p-4">
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                                    isPending
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-green-100 text-green-800"
                                                                }`}
                                                            >
                                                                {status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="bg-[#F5F1EC] rounded-lg p-4 sm:p-6 border-t-2 border-[#D8C3A5]">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">Total Records</p>
                                        <p className="text-2xl font-bold text-[#A79277]">{orders.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">Displayed Records</p>
                                        <p className="text-2xl font-bold text-[#A79277]">{displayOrders.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                                        <p className="text-2xl font-bold text-[#A79277]">₹{calculateTotal().toFixed(2)}</p>
                                    </div>
                                </div>

                                {hasMoreRecords && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                                        <strong>Note:</strong> Showing 10 of {orders.length} records. Scroll to see more.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
