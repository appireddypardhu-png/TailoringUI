// ================================
// pages/Home.jsx
// ================================
import { useState } from "react";
import Logo from "../assets/logo_main.png";
import HomeBack from "../assets/HomeBack.png";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { DRESS_PRICING } from "../constants/dressTypes";

export default function Home({ isAuthenticated }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [imageError, setImageError] = useState("");
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

    const navigate = useNavigate();
    const services = [
        {
            title: "Blouse Stitching",
            desc: "Custom designer blouses with perfect fitting and premium finishing.",
            folder: "Blouse",
            image:
                "https://i.pinimg.com/736x/85/9b/bc/859bbc1578269e34b03b24afc49bdaf4.jpg",
        },
        {
            title: "Lehenga Designing",
            desc: "Elegant bridal and party wear lehenga stitching.",
            folder: "Lehenga",
            image:
                "https://i.pinimg.com/736x/2a/cb/f3/2acbf3c19e8cba0544e88218d87bbe62.jpg",
        },
        {
            title: "Custom Measurements",
            desc: "Professional tailoring for every customer.",
            folder: "Custom",
            image:
                "https://i.pinimg.com/736x/5a/a9/95/5aa99546ed46c23dfba5bf2e803c661c.jpg",
        },
        {
            title: "Maggam Work",
            desc: "Exquisite embellished designs with intricate beadwork and embroidery.",
            folder: "Maggam",
            image:
                "https://i.pinimg.com/736x/b2/c7/9b/b2c79b8d6dcc975d72bc64a6c4a3b823.jpg",
        },
        {
            title: "Long Frocks",
            desc: "Stylish and elegant long frocks for every occasion.",
            folder: "LongFrocks",
            image:
                "https://i.pinimg.com/736x/1e/5e/97/1e5e97e2ac11e65e10c41b5fb295644d.jpg",
        },
    ];

    const fetchFolderImages = async (folder, title) => {
        setIsModalOpen(true);
        setModalTitle(title);
        setLoadingImages(true);
        setImageError("");
        setImages([]);
        setIsLightboxOpen(false);

        try {
            const response = await API.get(`/api/images/folders/${encodeURIComponent(folder)}`);
            const rootImages = response?.data?.data?.root;

            if (Array.isArray(rootImages)) {
                setImages(rootImages);
            } else {
                setImageError("Unable to fetch images");
            }
        } catch (error) {
            setImageError("Unable to fetch images");
        } finally {
            setLoadingImages(false);
        }
    };

    const openLightbox = (index) => {
        setActiveImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const showPrevImage = (event) => {
        event.stopPropagation();
        setActiveImageIndex((current) =>
            images.length === 0 ? current : (current - 1 + images.length) % images.length
        );
    };

    const showNextImage = (event) => {
        event.stopPropagation();
        setActiveImageIndex((current) =>
            images.length === 0 ? current : (current + 1) % images.length
        );
    };

    const pricing = DRESS_PRICING;

    return (
        <div className="bg-[#FFF2E1] text-[#5E503F] overflow-hidden">
            {/* NAVBAR */}

            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF2E1]/90 backdrop-blur-lg border-b border-[#D8C3A5]">

                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div className="bg-[#F8EBDD] rounded-full p-2 shadow-sm" style={{ padding: '0px' }}>
                            <img
                                src={Logo}
                                alt="SaiRam Boutique"
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl sm:text-5xl font-bold text-[#A79277] leading-none">
                                SaiRam Ladies Boutique
                            </h1>

                            <p className="text-[10px] sm:text-xs tracking-[4px] text-[#B9A58C] mt-1">
                                PREMIUM TAILORING STUDIO
                            </p>
                        </div>

                    </div>

                    <button
                        className="sm:hidden rounded-lg border border-[#A79277] px-3 py-2 text-sm font-semibold"
                        onClick={() => setMenuOpen((open) => !open)}
                        type="button"
                    >
                        {menuOpen ? "Close" : "Menu"}
                    </button>

                    <div className="hidden sm:flex gap-8 text-[#5E503F] font-medium items-center">

                        <a
                            href="#home"
                            className="hover:text-[#A79277] transition"
                        >
                            Home
                        </a>

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

                        <button
                            onClick={() =>
                                navigate(
                                    isAuthenticated
                                        ? "/customers"
                                        : "/login"
                                )
                            }
                            className="
                            bg-[#A79277]
                            text-white
                            px-5
                            py-2.5
                            rounded-full
                            hover:bg-[#8E7A61]
                            hover:scale-105
                            transition
                            duration-300
                            shadow-md
                            text-sm
                            "
                        >
                            Admin
                        </button>

                    </div>

                </div>

                {menuOpen && (
                    <div className="sm:hidden border-t border-[#D8C3A5] px-4 pb-4 pt-3">
                        <div className="flex flex-col gap-3 text-[#5E503F] font-medium">
                            <a href="#home" className="hover:text-[#A79277] transition" onClick={() => setMenuOpen(false)}>
                                Home
                            </a>
                            <a href="#services" className="hover:text-[#A79277] transition" onClick={() => setMenuOpen(false)}>
                                Services
                            </a>
                            <a href="#about" className="hover:text-[#A79277] transition" onClick={() => setMenuOpen(false)}>
                                About
                            </a>
                            <a href="#contact" className="hover:text-[#A79277] transition" onClick={() => setMenuOpen(false)}>
                                Contact
                            </a>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate(
                                        isAuthenticated
                                            ? "/customers"
                                            : "/login"
                                    );
                                }}
                                className="bg-[#A79277] text-white px-5 py-2.5 rounded-full hover:bg-[#8E7A61] transition duration-300 shadow-md text-sm"
                            >
                                Admin Panel
                            </button>
                        </div>
                    </div>
                )}

            </nav>

            <div className="pt-28 sm:pt-20">

            {/* HERO */}
            <section
                id="home"
                className="relative h-screen flex items-center justify-center"
            >
                <img
                    src={HomeBack}
                    alt="Tailoring studio background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />

                <div className="absolute inset-0 bg-[#5E503F]/60" />

                <div className="relative z-10 text-center px-6">
                    <p className="uppercase tracking-[6px] text-[#A79277] mb-6">
                        Premium Boutique & Tailoring Studio
                    </p>

                    <h1 className="text-4xl sm:text-6xl font-black mb-8 text-white">
                        Elegant Tailoring
                        <span className="block text-[#FFF2E1]">
                            Crafted For Women
                        </span>
                    </h1>

                    <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-8 mb-10">
                        Professional ladies tailoring services with bridal stitching,
                        designer blouses and premium boutique fashion.
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsPriceModalOpen(true)}
                        className="bg-[#A79277] text-white px-8 py-4 rounded-full hover:bg-[#8E7A61] transition duration-300"
                    >
                        View Price List
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

                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Tailoring Services
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {services.map((service, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => fetchFolderImages(service.folder, service.title)}
                                className="group cursor-pointer text-left bg-white rounded-[30px] overflow-hidden shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="h-80 overflow-hidden">
                                    <img
                                        src={service.image}
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                        alt={service.title}
                                    />
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-4 text-[#A79277]">
                                        {service.title}
                                    </h3>

                                    <p className="leading-7 text-[#5E503F] mb-4">
                                        {service.desc}
                                    </p>

                                    <p className="text-sm font-semibold uppercase tracking-[2px] text-[#A79277]">
                                        Click to see our works
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="py-28 bg-[#FAF7F0]">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <img
                        src="https://i.pinimg.com/736x/9e/42/d5/9e42d509b9c1516d09bd7e82be71ac40.jpg"
                        className="rounded-[40px] shadow-2xl"
                    />

                    <div>
                        <p className="uppercase tracking-[4px] text-[#A79277] mb-4">
                            About Us
                        </p>

                        <h2 className="text-4xl sm:text-5xl font-bold mb-8">
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
                    <h2 className="text-4xl sm:text-5xl font-bold mb-10">
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

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => {
                        setIsModalOpen(false);
                        setIsLightboxOpen(false);
                    }}
                >
                    <div
                        className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[30px] bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E8E1D8] px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[4px] text-[#A79277]">
                                    Our Works
                                </p>
                                <h3 className="text-2xl font-bold text-[#5E503F]">
                                    {modalTitle}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setIsLightboxOpen(false);
                                }}
                                className="rounded-full border border-[#D8C3A5] px-4 py-2 text-sm font-semibold text-[#5E503F] hover:bg-[#F8EBDD]"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
                            {loadingImages ? (
                                <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center text-[#5E503F]">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#A79277]/30 border-t-[#A79277]" />
                                    <p className="text-lg font-semibold">Loading works...</p>
                                    <p className="max-w-xl text-sm text-[#7A6A55]">
                                        It might take a minute. Please wait.
                                    </p>
                                </div>
                            ) : imageError ? (
                                <div className="min-h-[240px] flex items-center justify-center text-lg font-semibold text-[#C43D3D]">
                                    Unable to fetch images
                                </div>
                            ) : images.length === 0 ? (
                                <div className="min-h-[240px] flex items-center justify-center text-[#5E503F]">
                                    No images found for this folder.
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {images.map((image, index) => (
                                        <div key={image.public_id} className="overflow-hidden rounded-[24px] bg-[#F7F2EB] shadow-sm">
                                            <img
                                                src={image.url}
                                                alt={image.filename}
                                                className="h-48 w-full cursor-pointer object-cover transition duration-300 hover:scale-105"
                                                onClick={() => openLightbox(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4"
                    onClick={closeLightbox}
                >
                    <div
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[30px] bg-[#111111] shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#5E503F] hover:bg-white"
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            onClick={showPrevImage}
                            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl font-bold text-[#5E503F] hover:bg-white"
                        >
                            ‹
                        </button>

                        <button
                            type="button"
                            onClick={showNextImage}
                            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl font-bold text-[#5E503F] hover:bg-white"
                        >
                            ›
                        </button>

                        <div className="flex h-full items-center justify-center p-6">
                            <img
                                src={images[activeImageIndex]?.url}
                                alt={images[activeImageIndex]?.filename || "Selected work image"}
                                className="max-h-[80vh] max-w-full rounded-[24px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {isPriceModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setIsPriceModalOpen(false)}
                >
                    <div
                        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[30px] bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E8E1D8] px-6 py-4">
                            <div>
                                <p className="text-xs uppercase tracking-[4px] text-[#A79277]">
                                    Our Prices
                                </p>
                                <h3 className="text-2xl font-bold text-[#5E503F]">
                                    Price Guide
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPriceModalOpen(false)}
                                className="rounded-full border border-[#D8C3A5] px-4 py-2 text-sm font-semibold text-[#5E503F] hover:bg-[#F8EBDD]"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
                            <p className="text-sm text-[#7A6A55] mb-6">
                                Here are our pricing options in INR for different tailoring services. Final pricing may vary based on fabric, customization, and design complexity.
                            </p>

                            <div className="overflow-hidden rounded-[24px] border border-[#E8E1D8] bg-[#FAF7F0]">
                                <div className="max-h-[50vh] overflow-y-auto">
                                    <table className="min-w-full divide-y divide-[#E8E1D8] text-left">
                                        <thead className="bg-white sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[2px] text-[#5E503F]">
                                                    Service Type
                                                </th>
                                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[2px] text-[#5E503F]">
                                                    Price (INR)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E8E1D8] bg-[#FAF7F0]">
                                            {pricing.map((item) => (
                                                <tr key={item.label}>
                                                    <td className="px-6 py-5 text-sm font-semibold text-[#5E503F]">
                                                        {item.label}
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-[#5E503F]">
                                                        {item.price}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}