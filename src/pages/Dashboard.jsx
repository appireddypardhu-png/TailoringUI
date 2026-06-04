export default function Dashboard() {

    const cards = [
        {
            title: "Customers",
            value: "1200+",
        },
        {
            title: "Orders",
            value: "3500+",
        },
        {
            title: "Revenue",
            value: "₹2.5L",
        },
        {
            title: "Pending",
            value: "45",
        },
    ];

    return (

        <div className="min-h-screen bg-[#FFF2E1] p-10">

            <h1 className="text-5xl font-bold text-[#A79277] mb-12">
                Admin Dashboard
            </h1>

            <div className="grid md:grid-cols-4 gap-8">

                {cards.map((card, index) => (

                    <div
                        key={index}
                        className="bg-white p-10 rounded-3xl shadow-lg"
                    >

                        <h2 className="text-4xl font-bold text-[#A79277] mb-3">
                            {card.value}
                        </h2>

                        <p className="text-gray-600 text-lg">
                            {card.title}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );
}