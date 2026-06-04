// ================================
// pages/Home.jsx
// ================================
import Logo from "../assets/logo_main.png";
import { useNavigate } from "react-router-dom";

export default function Home({ isAuthenticated }) {

    const navigate = useNavigate();
    const services = [
        {
            title: "Blouse Stitching",
            desc: "Custom designer blouses with perfect fitting and premium finishing.",
            image:
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
        },
        {
            title: "Lehenga Designing",
            desc: "Elegant bridal and party wear lehenga stitching.",
            image:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
        },
        {
            title: "Custom Measurements",
            desc: "Professional tailoring for every customer.",
            image:
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
        },
    ];

    return (
        <div className="bg-[#FFF2E1] text-[#5E503F] overflow-hidden">
            {/* NAVBAR */}

            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF2E1]/90 backdrop-blur-lg border-b border-[#D8C3A5]">

                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-5">

                        <div className="bg-[#F8EBDD] rounded-full p-2 shadow-sm" style={{ padding: '0px' }}>
                            <img
                                src={Logo}
                                alt="SaiRam Boutique"
                                className="h-20 w-20 object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-5xl font-bold text-[#A79277] leading-none">
                                SaiRam Ladies Boutique
                            </h1>

                            <p className="text-xs tracking-[4px] text-[#B9A58C] mt-1">
                                PREMIUM TAILORING STUDIO
                            </p>
                        </div>

                    </div>
                    <div className="hidden md:flex gap-8 text-[#5E503F] font-medium items-center">

                        {/* HOME PAGE */}
                        <a
                            href="#home"
                            className="hover:text-[#A79277] transition"
                        >
                            Home
                        </a>

                        {/* SAME PAGE SCROLL LINKS */}
                        <a
                            href="#services"
                            className="hover:text-[#A79277] transition"
                        >
                            Services
                        </a>

                        <a
                            href="#about"
                            className="hover:text-[#A79277] transition"
                        >
                            About
                        </a>

                        <a
                            href="#contact"
                            className="hover:text-[#A79277] transition"
                        >
                            Contact
                        </a>

                        {/* DIFFERENT PAGE */}
                        <button
                            onClick={() =>
                                navigate(
                                    isAuthenticated
                                        ? "/dashboard"
                                        : "/login"
                                )
                            }
                            className="
                            bg-[#A79277]
                            text-white
                            px-6
                            py-3
                            rounded-full
                            hover:bg-[#8E7A61]
                            hover:scale-105
                            transition
                            duration-300
                            shadow-md
                            "
                        >
                            Admin Panel
                        </button>

                    </div>

                </div>

            </nav>

            {/* HERO */}
            <section
                id="home"
                className="relative h-screen flex items-center justify-center"
            >
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />

                <div className="absolute inset-0 bg-[#5E503F]/60" />

                <div className="relative z-10 text-center px-6">
                    <p className="uppercase tracking-[6px] text-[#A79277] mb-6">
                        Premium Boutique & Tailoring Studio
                    </p>

                    <h1 className="text-6xl font-black mb-8 text-white">
                        Elegant Tailoring
                        <span className="block text-[#FFF2E1]">
                            Crafted For Women
                        </span>
                    </h1>

                    <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-8 mb-10">
                        Professional ladies tailoring services with bridal stitching,
                        designer blouses and premium boutique fashion.
                    </p>

                    <button className="bg-[#A79277] text-white px-8 py-4 rounded-full">
                        Book Appointment
                    </button>
                </div>
            </section>

            {/* SERVICES */}
            <section id="services" className="py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="uppercase tracking-[4px] text-[#A79277] mb-4">
                            Our Services
                        </p>

                        <h2 className="text-5xl font-bold mb-6">
                            Tailoring Services
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[30px] overflow-hidden shadow-xl"
                            >
                                <div className="h-80 overflow-hidden">
                                    <img
                                        src={service.image}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-4 text-[#A79277]">
                                        {service.title}
                                    </h3>

                                    <p className="leading-7 text-[#5E503F]">
                                        {service.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="py-28 bg-[#FAF7F0]">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
                        className="rounded-[40px] shadow-2xl"
                    />

                    <div>
                        <p className="uppercase tracking-[4px] text-[#A79277] mb-4">
                            About Us
                        </p>

                        <h2 className="text-5xl font-bold mb-8">
                            Premium Ladies Tailoring Experience
                        </h2>

                        <p className="text-lg leading-8 mb-6">
                            Luxury tailoring with elegant designs and perfect fitting.
                        </p>

                        <button className="bg-[#A79277] text-white px-8 py-4 rounded-full">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="py-28">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-bold mb-10">
                        Book Appointment
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8" style={{ userSelect: "none" }}>
                        <div className="bg-white p-8 rounded-3xl shadow-lg" >
                            <h3 className="text-2xl font-bold mb-4 text-[#A79277]">
                                Phone
                            </h3>

                            <p style={{ userSelect: "all" }}>+91 9063201063</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 text-[#A79277]">
                                Address
                            </h3>

                            <a
                                href="https://maps.app.goo.gl/ushvh1Ly8x55wBHq7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#A79277] underline"
                            >
                                Flat No:- G-4, Anantha Nilayam, Kondapur, Anand Nagar Colony, Gachibowli, Hyderabad, Telangana 500084
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 text-[#A79277]">
                                Timing
                            </h3>

                            <p>8 AM - 10 PM</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}