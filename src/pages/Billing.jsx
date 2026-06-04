export default function Billing() {

    return (

        <div className="min-h-screen bg-[#FFF2E1] p-10">

            <h1 className="text-5xl font-bold text-[#A79277] mb-10">
                Billing System
            </h1>

            <div className="bg-white p-10 rounded-3xl shadow-lg">

                <div className="grid md:grid-cols-2 gap-5">

                    <input
                        type="text"
                        placeholder="Customer Name"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="number"
                        placeholder="Amount"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="text"
                        placeholder="Dress Type"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="date"
                        className="border rounded-2xl px-5 py-4"
                    />

                </div>

                <button className="mt-8 bg-[#A79277] text-white px-8 py-4 rounded-2xl">
                    Generate Bill
                </button>

            </div>

        </div>

    );
}