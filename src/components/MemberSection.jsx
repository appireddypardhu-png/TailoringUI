import { useState } from "react";
import { Modal, Form, Input, Divider, Row, Col } from "antd";
import API from "../services/api";

export default function MemberSection({ members, customerId, onRefresh }) {
    const [form] = Form.useForm();
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [memberLoading, setMemberLoading] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState(null);

    const openEditMember = (member) => {
        setEditingMemberId(member.mid || null);
        form.setFieldsValue({
            mname: member.mname || "",
            bust: member.topMeasurement?.bust ?? null,
            waist: member.topMeasurement?.waist ?? null,
            shoulder: member.topMeasurement?.shoulder ?? null,
            sleeveLength: member.topMeasurement?.sleeveLength ?? null,
            armhole: member.topMeasurement?.armhole ?? null,
            blouseLength: member.topMeasurement?.blouseLength ?? null,
            dressLength: member.topMeasurement?.dressLength ?? null,
            sleeveRound: member.topMeasurement?.sleeveRound ?? null,
            dressHip: member.topMeasurement?.dressHip ?? null,
            bottomWaist: member.bottomMeasurement?.waist ?? null,
            hip: member.bottomMeasurement?.hip ?? null,
            pantLength: member.bottomMeasurement?.pantLength ?? null,
            mori: member.bottomMeasurement?.mori ?? null,
            thighRound: member.bottomMeasurement?.thighRound ?? null,
        });
        setMemberModalOpen(true);
    };

    const openAddMember = () => {
        form.resetFields();
        setEditingMemberId(null);
        setMemberModalOpen(true);
    };

    const handleMemberSubmit = async () => {
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
                    shoulder: values.shoulder || null,
                    bust: values.bust || null,
                    waist: values.waist || null,
                    blouseLength: values.blouseLength || null,
                    sleeveLength: values.sleeveLength || null,
                    sleeveRound: values.sleeveRound || null,
                    armhole: values.armhole || null,
                    dressHip: values.dressHip || null,
                    dressLength: values.dressLength || null,
                },
                bottomMeasurement: {
                    waist: values.bottomWaist || null,
                    hip: values.hip || null,
                    pantLength: values.pantLength || null,
                    mori: values.mori || null,
                    thighRound: values.thighRound || null,
                },
            };

            if (editingMemberId) {
                await API.put(`/member/${editingMemberId}`, payload);
            } else {
                await API.post("/member", payload);
            }

            await onRefresh();
            form.resetFields();
            setMemberModalOpen(false);
            setEditingMemberId(null);
        } catch (err) {
            console.error("Error saving member:", err);
        } finally {
            setMemberLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-[#A79277] text-white p-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">Members</h2>
                <button
                    onClick={openAddMember}
                    className="bg-white text-[#A79277] px-4 py-2 rounded-lg font-semibold hover:bg-[#f3eee7]"
                >
                    Add Member
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[250px]">
                    <thead className="bg-[#EFE6DD]">
                        <tr>
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
                                <td className="p-4">{member.mname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title={editingMemberId ? "Edit Member" : "Add Member"}
                open={memberModalOpen}
                onOk={handleMemberSubmit}
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
                    <Form.Item
                        name="mname"
                        label="Member Name"
                        rules={[{ required: true, message: "Please enter member name" }]}
                    >
                        <Input placeholder="Enter member name" />
                    </Form.Item>

                    <Divider>Top Measurements</Divider>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="shoulder" label="Shoulder">
                                <Input type="number" placeholder="Enter shoulder" step="0.1" />
                            </Form.Item>
                        </Col>
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
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="blouseLength" label="Blouse Length">
                                <Input type="number" placeholder="Enter blouse length" step="0.1" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="sleeveLength" label="Sleeve Length">
                                <Input type="number" placeholder="Enter sleeve length" step="0.1" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="sleeveRound" label="Sleeve Round">
                                <Input type="number" placeholder="Enter sleeve round" step="0.1" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="armhole" label="Armhole">
                                <Input type="number" placeholder="Enter armhole" step="0.1" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="dressHip" label="Dress Hip">
                                <Input type="number" placeholder="Enter dress hip" step="0.1" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="dressLength" label="Dress Length">
                                <Input type="number" placeholder="Enter dress length" step="0.1" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Bottom Measurements</Divider>
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
                            <Form.Item name="pantLength" label="Pant Length">
                                <Input type="number" placeholder="Enter pant length" step="0.1" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="mori" label="Mori">
                                <Input type="number" placeholder="Enter mori" step="0.1" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item name="thighRound" label="Thigh Round">
                                <Input type="number" placeholder="Enter thigh round" step="0.1" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
