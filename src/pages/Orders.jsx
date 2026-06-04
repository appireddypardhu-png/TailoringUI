export default function Orders() {

    const orders = [
        {
            id: 101,
            customer: "Pardhu",
            dress: "Designer Blouse",
            amount: "₹2500",
            status: "Pending",
        },
        {
            id: 102,
            customer: "Keerthi",
            dress: "Lehenga",
            amount: "₹5000",
            status: "Completed",
        },
    ];

    return (
        <div className="min-h-screen bg-[#FFF2E1] p-10">

            <h1 className="text-5xl font-bold text-[#A79277] mb-10">
                Orders Dashboard
            </h1>

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                <table className="w-full">

                    <thead className="bg-[#A79277] text-white">

                        <tr>
                            <th className="p-5 text-left">Order ID</th>
                            <th className="p-5 text-left">Customer</th>
                            <th className="p-5 text-left">Dress</th>
                            <th className="p-5 text-left">Amount</th>
                            <th className="p-5 text-left">Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {orders.map((order) => (

                            <tr
                                key={order.id}
                                className="border-b"
                            >
                                <td className="p-5">#{order.id}</td>
                                <td className="p-5">{order.customer}</td>
                                <td className="p-5">{order.dress}</td>
                                <td className="p-5">{order.amount}</td>
                                <td className="p-5">{order.status}</td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}