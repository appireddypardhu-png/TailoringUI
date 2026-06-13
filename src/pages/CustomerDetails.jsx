import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Form, Input, Divider, Row, Col } from "antd";
import API from "../services/api";

export default function CustomerDetails() {
    const [form] = Form.useForm();
    const { customerId } = useParams();
    const navigate = useNavigate();

    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [members, setMembers] = useState([]);
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [memberLoading, setMemberLoading] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState(null);

    

    // Fetch function extracted so it can be reused after creating a member
    const fetchCustomerDetails = async () => {
        if (!customerId) return;
        try {
            setLoading(true);
            const response = await API.get(`/customer/${customerId}`);
            setCustomerData(response.data);
            setMembers(response.data.members || []);
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

    const openEditMember = (member) => {
        setEditingMemberId(member.mid || null);
        form.setFieldsValue({
            mname: member.mname || "",
            bust: member.topMeasurement?.bust ?? null,
            waist: member.topMeasurement?.waist ?? null,
            shoulder: member.topMeasurement?.shoulder ?? null,
            sleeveLength: member.topMeasurement?.sleeveLength ?? null,
            topLength: member.topMeasurement?.topLength ?? null,
            neckSize: member.topMeasurement?.neckSize ?? null,
            armhole: member.topMeasurement?.armhole ?? null,
            bottomWaist: member.bottomMeasurement?.waist ?? null,
            hip: member.bottomMeasurement?.hip ?? null,
            thigh: member.bottomMeasurement?.thigh ?? null,
            kneeSize: member.bottomMeasurement?.kneeSize ?? null,
            ankleSize: member.bottomMeasurement?.ankleSize ?? null,
            bottomLength: member.bottomMeasurement?.bottomLength ?? null,
        });
        setMemberModalOpen(true);
    };

    const customer = customerData || {};
    const orders = customerData?.orders || [];

    const handleAddMember = async () => {
        setMemberLoading(true);
        try {
            const values = await form.validateFields();
            const trimmedName = values.mname?.trim();
            if (!trimmedName) {
                setMemberLoading(false);
                return;
            }

            const payload = {
                mname: trimmedName,
                customerid: customerId,
                topMeasurement: {
                    bust: values.bust || null,
                    waist: values.waist || null,
                    shoulder: values.shoulder || null,
                    sleeveLength: values.sleeveLength || null,
                    topLength: values.topLength || null,
                    neckSize: values.neckSize || null,
                    armhole: values.armhole || null,
                },
                bottomMeasurement: {
                    waist: values.bottomWaist || null,
                    hip: values.hip || null,
                    thigh: values.thigh || null,
                    kneeSize: values.kneeSize || null,
                    ankleSize: values.ankleSize || null,
                    bottomLength: values.bottomLength || null,
                },
            };

            // Post or update to backend
            if (editingMemberId) {
                await API.put(`/member/${editingMemberId}`, payload);
            } else {
                await API.post("/member", payload);
            }

            // Refresh customer details from server
            await fetchCustomerDetails();

            form.resetFields();
            setMemberModalOpen(false);
            setEditingMemberId(null);
        } catch (err) {
            console.error("Error adding member:", err);
            // Keep modal open so user can correct; optionally setError
        } finally {
            setMemberLoading(false);
        }
    };

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
                            {customer.cname}
                        </h2>
                    </div>

                    <div>
                        <p className="text-gray-500">Phone Number</p>
                        <h2 className="text-2xl font-semibold">
                            {customer.cphone}
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

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">

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

                </div>

                {/* Members */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

<div className="bg-[#A79277] text-white p-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-2xl font-bold">
                            Members
                        </h2>
                        <button
                            onClick={() => { form.resetFields(); setEditingMemberId(null); setMemberModalOpen(true); }}
                            className="bg-white text-[#A79277] px-4 py-2 rounded-lg font-semibold hover:bg-[#f3eee7]"
                        >
                            Add Member
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px]">

                        <thead className="bg-[#EFE6DD]">
                            <tr>
                                <th className="text-left p-4">Member ID</th>
                                <th className="text-left p-4">Name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members.map((member) => (
                                <tr
                                    key={member.mid}
                                    onClick={() => openEditMember(member)}
                                    className="border-b hover:bg-[#FAF7F0] cursor-pointer"
                                >
                                    <td className="p-4">{member.mid}</td>
                                    <td className="p-4">{member.mname}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    </div>

                </div>

            </div>
                <Modal
                    title={editingMemberId ? "Edit Member" : "Add Member"}
                    open={memberModalOpen}
                    onOk={handleAddMember}
                    confirmLoading={memberLoading}
                    onCancel={() => {
                        form.resetFields();
                        setMemberModalOpen(false);
                        setEditingMemberId(null);
                    }}
                    okText={editingMemberId ? "Update" : "Add"}
                    cancelText="Cancel"
                    width={700}
                    bodyStyle={{ maxHeight: "500px", overflowY: "auto" }}
                >
                    <Form form={form} layout="vertical">
                        {/* Member Name */}
                        <Form.Item
                            name="mname"
                            label="Member Name"
                            rules={[{ required: true, message: "Please enter member name" }]}
                        >
                            <Input placeholder="Enter member name" />
                        </Form.Item>

                        <Divider>Top Measurements</Divider>

                        {/* Top Measurements Grid */}
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="bust" label="Bust">
                                    <Input type="number" placeholder="Enter bust" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="waist" label="Waist">
                                    <Input type="number" placeholder="Enter waist" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="shoulder" label="Shoulder">
                                    <Input type="number" placeholder="Enter shoulder" step="0.1" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="sleeveLength" label="Sleeve Length">
                                    <Input type="number" placeholder="Enter sleeve length" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="topLength" label="Top Length">
                                    <Input type="number" placeholder="Enter top length" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="neckSize" label="Neck Size">
                                    <Input type="number" placeholder="Enter neck size" step="0.1" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="armhole" label="Armhole">
                                    <Input type="number" placeholder="Enter armhole" step="0.1" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider>Bottom Measurements</Divider>

                        {/* Bottom Measurements Grid */}
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="bottomWaist" label="Waist">
                                    <Input type="number" placeholder="Enter waist" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="hip" label="Hip">
                                    <Input type="number" placeholder="Enter hip" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="thigh" label="Thigh">
                                    <Input type="number" placeholder="Enter thigh" step="0.1" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="kneeSize" label="Knee Size">
                                    <Input type="number" placeholder="Enter knee size" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="ankleSize" label="Ankle Size">
                                    <Input type="number" placeholder="Enter ankle size" step="0.1" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="bottomLength" label="Bottom Length">
                                    <Input type="number" placeholder="Enter bottom length" step="0.1" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>                </>
            )}

        </div>
    );
}