import { useEffect, useState } from "react";

import API from "../services/api";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
export default function Customers() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");

    const [cname, setCname] = useState("");

    const [cphone, setCphone] = useState("");

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

    // LOAD CUSTOMERS
    const loadCustomers = async () => {

        try {

            setLoading(true);

            const response =
                await API.get("/customer");

            setCustomers(response.data);

        }
        catch (error) {

            console.log(error);
        }
        finally {

            setLoading(false);
        }
    };

    // ADD CUSTOMER
    const addCustomer = async () => {

        if (!cname || !cphone) {

            alert("Please fill all fields");

            return false;
        }

        try {

            setSaving(true);

            await API.post(
                "/customer",
                {
                    cname,
                    cphone
                }
            );

            setCname("");

            setCphone("");

            loadCustomers();

            return true;
        }
        catch (error) {

            console.log(error);

            alert("Failed to add customer");
            return false;
        }
        finally {

            setSaving(false);
        }
    };

    // INITIAL LOAD
    useEffect(() => {

        loadCustomers();

    }, []);

    // SEARCH FILTER
    const sortedCustomers = [...customers].sort((a, b) =>
        (a.cname || "").localeCompare(b.cname || "", undefined, {
            sensitivity: "base",
        })
    );

    const filteredCustomers =
        sortedCustomers.filter((customer) =>

            customer.cname
                .toLowerCase()
                .includes(search.toLowerCase())

            ||

            customer.cphone.includes(search)
        );

    return (

        <div className="min-h-screen bg-[#FFF2E1] p-4 sm:p-10">

            {showAddCustomerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-[#A79277]">New Customer</h3>
                            <button
                                type="button"
                                onClick={() => setShowAddCustomerModal(false)}
                                className="text-gray-500 hover:text-gray-900"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-5">
                            <input
                                type="text"
                                placeholder="Customer Name"
                                value={cname}
                                onChange={(e) => setCname(e.target.value)}
                                className="w-full border border-[#D8C3A5] rounded-2xl px-5 py-4 outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={cphone}
                                onChange={(e) => setCphone(e.target.value)}
                                className="w-full border border-[#D8C3A5] rounded-2xl px-5 py-4 outline-none"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddCustomerModal(false)}
                                    className="rounded-2xl border border-[#D8C3A5] px-6 py-3 text-sm text-[#3B3A3A] hover:bg-[#F5F1EC] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const success = await addCustomer();
                                        if (success) {
                                            setShowAddCustomerModal(false);
                                        }
                                    }}
                                    disabled={saving}
                                    className="bg-[#A79277] text-white rounded-2xl px-6 py-3 text-sm hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? "Saving..." : "Add Customer"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOMER TABLE */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                <div className="bg-[#A79277] text-white px-8 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-3xl font-bold">All Customers</h2>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search by name or phone number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-72 border border-[#D8C3A5] rounded-2xl px-4 py-3 outline-none text-black bg-white"
                            />

                            <button
                                type="button"
                                onClick={() => setShowAddCustomerModal(true)}
                                className="bg-white text-[#A79277] rounded-2xl px-5 py-3 text-sm hover:scale-105 transition"
                            >
                                New Customer
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        // fetch fresh data to ensure complete nested members are included
                                        const resp = await API.get("/customer");
                                        const customers = resp.data || [];

                                        const rows = [];

                                        customers.forEach((c) => {
                                            if (Array.isArray(c.members) && c.members.length > 0) {
                                                c.members.forEach((m) => {
                                                    rows.push({
                                                        customerid: c.customerid,
                                                        cname: c.cname,
                                                        cphone: c.cphone,
                                                        mid: m.mid,
                                                        mname: m.mname,
                                                        topid: m.topMeasurement?.topid ?? "",
                                                        bust: m.topMeasurement?.bust ?? "",
                                                        top_waist: m.topMeasurement?.waist ?? "",
                                                        shoulder: m.topMeasurement?.shoulder ?? "",
                                                        sleeveLength: m.topMeasurement?.sleeveLength ?? "",
                                                        topLength: m.topMeasurement?.topLength ?? "",
                                                        neckSize: m.topMeasurement?.neckSize ?? "",
                                                        armhole: m.topMeasurement?.armhole ?? "",
                                                        bottomid: m.bottomMeasurement?.bottomid ?? "",
                                                        bottom_waist: m.bottomMeasurement?.waist ?? "",
                                                        hip: m.bottomMeasurement?.hip ?? "",
                                                        thigh: m.bottomMeasurement?.thigh ?? "",
                                                        kneeSize: m.bottomMeasurement?.kneeSize ?? "",
                                                        ankleSize: m.bottomMeasurement?.ankleSize ?? "",
                                                        bottomLength: m.bottomMeasurement?.bottomLength ?? "",
                                                    });
                                                });
                                            } else {
                                                rows.push({
                                                    customerid: c.customerid,
                                                    cname: c.cname,
                                                    cphone: c.cphone,
                                                    mid: "",
                                                    mname: "",
                                                    topid: "",
                                                    bust: "",
                                                    top_waist: "",
                                                    shoulder: "",
                                                    sleeveLength: "",
                                                    topLength: "",
                                                    neckSize: "",
                                                    armhole: "",
                                                    bottomid: "",
                                                    bottom_waist: "",
                                                    hip: "",
                                                    thigh: "",
                                                    kneeSize: "",
                                                    ankleSize: "",
                                                    bottomLength: "",
                                                });
                                            }
                                        });

                                        const worksheet = XLSX.utils.json_to_sheet(rows);
                                        const workbook = XLSX.utils.book_new();
                                        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
                                        XLSX.writeFile(workbook, "customers.xlsx");
                                    } catch (err) {
                                        console.error("Export failed", err);
                                        alert("Failed to export customers");
                                    }
                                }}
                                title="Download customers"
                                className="ml-2 inline-flex items-center justify-center p-3 rounded-full bg-white text-[#A79277] hover:bg-white/90"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 11-2 0V5H5v10h4a1 1 0 110 2H4a1 1 0 01-1-1V3zm9.293 6.293a1 1 0 011.414 1.414L11 14.414V9a1 1 0 112 0v5.414l2.293-2.707a1 1 0 011.414 1.414l-4 4.5a1 1 0 01-1.414 0l-4-4.5a1 1 0 011.414-1.414L11 14.414V9a1 1 0 011.293-.707z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">

                {
                    loading
                        ?
                        (
                            <div className="
                            flex
                            justify-center
                            items-center
                            p-20
                        ">

                                <div className="
                                w-10
                                h-10
                                border-4
                                border-[#A79277]
                                border-t-transparent
                                rounded-full
                                animate-spin
                            "></div>

                            </div>
                        )
                        :
                        (
                            <table className="w-full min-w-[560px]">

                                <thead className="bg-[#EFE6DD]">

                                    <tr>

                                        <th className="text-left p-5">
                                            Customer ID
                                        </th>

                                        <th className="text-left p-5">
                                            Customer Name
                                        </th>

                                        <th className="text-left p-5">
                                            Phone Number
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredCustomers.map((customer) => (

                                        <tr
                                            key={customer.customerid}
                                            onClick={() =>
                                                navigate(
                                                    `/customers/${customer.customerid}`
                                                )
                                            }
                                            className="
        border-b
        hover:bg-[#FAF7F0]
        cursor-pointer
    "
                                        >


                                            <td className="p-5">
                                                {customer.customerid}
                                            </td>

                                            <td className="p-5">
                                                {customer.cname}
                                            </td>

                                            <td className="p-5">
                                                {customer.cphone}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>
                        )
                }

                </div>

            </div>

        </div>
    );
}