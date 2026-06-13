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

            return;
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

        }
        catch (error) {

            console.log(error);

            alert("Failed to add customer");
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

            {/* PAGE TITLE */}
            <h1 className="text-5xl font-bold text-[#A79277] mb-10">
                Customer Management
            </h1>



            {/* ADD CUSTOMER */}
            <div className="bg-white p-10 rounded-3xl shadow-lg mb-10">

                <h2 className="text-3xl font-bold text-[#A79277] mb-8">
                    Add Customer
                </h2>

                <div className="grid md:grid-cols-3 gap-5">

                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={cname}
                        onChange={(e) =>
                            setCname(e.target.value)
                        }
                        className="
                            border
                            border-[#D8C3A5]
                            rounded-2xl
                            px-5
                            py-4
                            outline-none
                        "
                    />

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={cphone}
                        onChange={(e) =>
                            setCphone(e.target.value)
                        }
                        className="
                            border
                            border-[#D8C3A5]
                            rounded-2xl
                            px-5
                            py-4
                            outline-none
                        "
                    />

                    <button
                        onClick={addCustomer}
                        disabled={saving}
                        className="
                            bg-[#A79277]
                            text-white
                            rounded-2xl
                            hover:scale-105
                            transition
                            flex
                            items-center
                            justify-center
                        "
                    >

                        {
                            saving
                                ?
                                (
                                    <div className="
                                    w-6
                                    h-6
                                    border-4
                                    border-white
                                    border-t-transparent
                                    rounded-full
                                    animate-spin
                                "></div>
                                )
                                :
                                (
                                    "Save Customer"
                                )
                        }

                    </button>

                </div>

            </div>
            {/* SEARCH */}
            <div className="bg-white p-6 rounded-3xl shadow-lg mb-8">

                <input
                    type="text"
                    placeholder="Search by name or phone number..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="
                        w-full
                        border
                        border-[#D8C3A5]
                        rounded-2xl
                        px-5
                        py-4
                        outline-none
                    "
                />

            </div>

            {/* CUSTOMER TABLE */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                <div className="bg-[#A79277] text-white px-8 py-5">

                    <h2 className="text-3xl font-bold">
                        All Customers
                    </h2>

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