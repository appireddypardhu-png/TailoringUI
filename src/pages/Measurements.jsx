export default function Measurements() {

    return (

        <div className="min-h-screen bg-[#FFF2E1] p-10">

            <h1 className="text-5xl font-bold text-[#A79277] mb-10">
                Measurement Form
            </h1>

            <div className="bg-white p-10 rounded-3xl shadow-lg">

                <div className="grid md:grid-cols-3 gap-5">

                    <input
                        type="number"
                        placeholder="Bust"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="number"
                        placeholder="Waist"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="number"
                        placeholder="Shoulder"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="number"
                        placeholder="Sleeve Length"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="number"
                        placeholder="Top Length"
                        className="border rounded-2xl px-5 py-4"
                    />

                    <input
                        type="number"
                        placeholder="Neck Size"
                        className="border rounded-2xl px-5 py-4"
                    />

                </div>

                <button className="mt-8 bg-[#A79277] text-white px-8 py-4 rounded-2xl">
                    Save Measurements
                </button>

            </div>

        </div>

    );
}