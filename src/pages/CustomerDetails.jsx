import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MemberSection from "../components/MemberSection";
import OrderSection from "../components/OrderSection";
import API from "../services/api";

export default function CustomerDetails() {
    const { customerId } = useParams();
    const navigate = useNavigate();

    const [customerData, setCustomerData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCustomerDetails = async () => {
        if (!customerId) return;
        try {
            setLoading(true);
            const [customerResponse, ordersResponse] = await Promise.all([
                API.get(`/customer/${customerId}`),
                API.get(`/orders/customer/${customerId}`)
            ]);
            setCustomerData(customerResponse.data);
            setOrders(ordersResponse.data || []);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch customer details");
            console.error("Error fetching customer details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomerDetails();
    }, [customerId]);

    const customer = customerData || {};

    return (
        <div className="min-h-screen bg-[#FFF2E1] p-4 sm:p-8">
            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-2xl text-[#A79277]">Loading...</div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                        <button
                            onClick={() => navigate("/customers")}
                            className="bg-[#A79277] text-white px-5 py-3 rounded-xl mb-8"
                        >
                            ← Back
                        </button>

                        <h1 className="text-4xl font-bold text-[#A79277] mb-6">
                            Customer Details
                        </h1>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500">Customer Name</p>
                                <h2 className="text-2xl font-semibold">{customer.cname}</h2>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone Number</p>
                                <h2 className="text-2xl font-semibold">{customer.cphone}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <MemberSection
                            members={customerData?.members || []}
                            customerId={customerId}
                            onRefresh={fetchCustomerDetails}
                        />
                        <OrderSection
                            orders={orders}
                            members={customerData?.members || []}
                            customerId={customerId}
                            onRefresh={fetchCustomerDetails}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

