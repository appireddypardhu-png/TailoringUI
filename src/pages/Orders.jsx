
import { useEffect, useState } from "react";
import OrderSection from "../components/OrderSection";
import API from "../services/api";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await API.get("/orders");
            setOrders(res.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-[#FFF2E1] p-4 sm:p-8">

            {loading && (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="text-2xl text-[#A79277]">Loading...</div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <div className="grid lg:grid-cols-1 gap-8">
                    <OrderSection
                        orders={orders}
                        members={[]}
                        onRefresh={fetchOrders}
                        showCustomerColumns={true}
                    />
                </div>
            )}
        </div>
    );
}