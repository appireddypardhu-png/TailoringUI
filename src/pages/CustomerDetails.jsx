export default function CustomerDetails() {
    const { customerId } = useParams();

    const navigate = useNavigate();
    const customer = {
        name: "Sita Devi",
        phone: "9876543210",
    };

    const members = [
        { id: 1, name: "Sita Devi" },
        { id: 2, name: "Anjali" },
        { id: 3, name: "Priya" },
    ];

    const orders = [
        { id: 101, item: "Blouse", status: "Pending" },
        { id: 102, item: "Lehenga", status: "Completed" },
        { id: 103, item: "Kurti", status: "In Progress" },
    ];

    return (
        <div className="min-h-screen bg-[#FFF2E1] p-8">

            {/* Customer Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                <button
                    onClick={() => navigate("/customers")}
                    className="
                    bg-[#A79277]
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    mb-8
                "
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-bold text-[#A79277] mb-6">
                    Customer Details
                </h1>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <p className="text-gray-500">Customer Name</p>
                        <h2 className="text-2xl font-semibold">
                            {customer.name}
                        </h2>
                    </div>

                    <div>
                        <p className="text-gray-500">Phone Number</p>
                        <h2 className="text-2xl font-semibold">
                            {customer.phone}
                        </h2>
                    </div>

                </div>

            </div>

            {/* Members + Orders */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/* Orders */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <div className="bg-[#A79277] text-white p-4">
                        <h2 className="text-2xl font-bold">
                            Recent Orders
                        </h2>
                    </div>

                    <table className="w-full">

                        <thead className="bg-[#EFE6DD]">
                            <tr>
                                <th className="text-left p-4">Order ID</th>
                                <th className="text-left p-4">Item</th>
                                <th className="text-left p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b hover:bg-[#FAF7F0]"
                                >
                                    <td className="p-4">{order.id}</td>
                                    <td className="p-4">{order.item}</td>
                                    <td className="p-4">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

                {/* Members */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <div className="bg-[#A79277] text-white p-4">
                        <h2 className="text-2xl font-bold">
                            Members
                        </h2>
                    </div>

                    <table className="w-full">

                        <thead className="bg-[#EFE6DD]">
                            <tr>
                                <th className="text-left p-4">Member ID</th>
                                <th className="text-left p-4">Name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members.map((member) => (
                                <tr
                                    key={member.id}
                                    className="border-b hover:bg-[#FAF7F0]"
                                >
                                    <td className="p-4">{member.id}</td>
                                    <td className="p-4">{member.name}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}