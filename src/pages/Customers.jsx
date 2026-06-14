import { useEffect, useState } from "react";

import API from "../services/api";
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
    const filteredCustomers =
        customers.filter((customer) =>

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

                    <h2 className="text-3xl font-bold">
                        All Customers
                    </h2>

                </div>

                <div className="px-6 py-5 border-b border-[#EFE6DD] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <input
                        type="text"
                        placeholder="Search by name or phone number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-[#D8C3A5] rounded-2xl px-4 py-3 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowAddCustomerModal(true)}
                        className="bg-[#A79277] text-white rounded-2xl px-5 py-3 text-sm hover:scale-105 transition"
                    >
                        New Customer
                    </button>
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