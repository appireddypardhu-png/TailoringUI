import { useState } from "react";
import { Modal, Form, Input, Divider, Row, Col, Select } from "antd";
import API from "../services/api";

export default function OrderSection({ orders, members, customerId, onRefresh, showCustomerColumns = false }) {
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [subOrders, setSubOrders] = useState([{ memberid: null, typeofdress: "", quantity: 1, price: 0 }]);
    const [subOrderErrors, setSubOrderErrors] = useState({});
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [searchText, setSearchText] = useState("");

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedSubOrders, setSelectedSubOrders] = useState([]);
    const [updatingSubOrderId, setUpdatingSubOrderId] = useState(null);

    const calculateTotal = () => {
        return subOrders.reduce((sum, order) => sum + (parseFloat(order.price) || 0), 0);
    };

    const handleAddSubOrder = () => {
        setSubOrders([...subOrders, { memberid: null, typeofdress: "", quantity: 1, price: 0 }]);
    };

    const handleRemoveSubOrder = (index) => {
        setSubOrders(subOrders.filter((_, i) => i !== index));
    };

    const handleSubOrderChange = (index, field, value) => {
        const updatedOrders = [...subOrders];
        updatedOrders[index][field] = value;
        setSubOrders(updatedOrders);
    };

    const handleCreateOrder = async () => {
        try {
            setOrderLoading(true);

            const errors = {};
            const hasErrors = subOrders.some((order, index) => {
                const orderErrors = {};

                if (!order.memberid) {
                    orderErrors.memberid = "Member is required";
                }
                if (!order.typeofdress?.trim()) {
                    orderErrors.typeofdress = "Type of dress is required";
                }
                if (!order.quantity || order.quantity < 1) {
                    orderErrors.quantity = "Quantity must be at least 1";
                }
                if (!order.price || order.price <= 0) {
                    orderErrors.price = "Price must be greater than 0";
                }

                if (Object.keys(orderErrors).length > 0) {
                    errors[index] = orderErrors;
                    return true;
                }
                return false;
            });

            if (hasErrors) {
                setSubOrderErrors(errors);
                return;
            }

            setSubOrderErrors({});

            const today = new Date().toISOString().split("T")[0];
            const payload = {
                customerid: parseInt(customerId),
                orderprice: calculateTotal(),
                orderStatus: "PENDING",
                orderdate: today,
                subOrders: subOrders.map((order) => ({
                    memberid: order.memberid,
                    typeofdress: order.typeofdress,
                    quantity: order.quantity,
                    price: order.price,
                    status: "NEW"
                }))
            };

            await API.post("/orders", payload);
            await onRefresh();

            setOrderModalOpen(false);
            setSubOrders([{ memberid: null, typeofdress: "", quantity: 1, price: 0 }]);
            setSubOrderErrors({});
        } catch (err) {
            console.error("Error creating order:", err);
            alert("Failed to create order");
        } finally {
            setOrderLoading(false);
        }
    };

    const handleOpenOrderModal = () => {
        setSubOrders([{ memberid: null, typeofdress: "", quantity: 1, price: 0 }]);
        setSubOrderErrors({});
        setOrderModalOpen(true);
    };

    const getMemberName = (memberid) => {
        const member = members.find((m) => m.mid === memberid || m.memberid === memberid);
        return member ? member.mname : "Unknown";
    };

    const getSelectedOrderTotal = () => {
        if (!selectedOrder) return 0;
        if (selectedOrder.orderprice || selectedOrder.orderprice === 0) {
            return selectedOrder.orderprice;
        }
        return selectedSubOrders.reduce((sum, row) => sum + (parseFloat(row.price) || 0), 0);
    };

    const getSelectedOrderDate = () => {
        const date = selectedOrder?.orderdate || selectedOrder?.date || selectedOrder?.orderdate;
        return date ? date.split("T")[0] : "-";
    };

    const openOrderDetails = async (order) => {
        try {
            setDetailsLoading(true);
            const orderData = order.subOrders?.length
                ? order
                : (await API.get(`/order/${order.id}`)).data;

            const rows = orderData.subOrders || orderData.suborders || [];
            setSelectedOrder(orderData);
            setSelectedSubOrders(rows);
            setDetailsModalOpen(true);
        } catch (err) {
            console.error("Error loading order details:", err);
            alert("Failed to load order details");
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeDetailsModal = () => {
        setDetailsModalOpen(false);
        setSelectedOrder(null);
        setSelectedSubOrders([]);
    };

    const handleMarkOrderCompleted = async (orderId) => {
        try {
            setUpdatingOrderId(orderId);
            const payload = { status: "COMPLETED" };
            await API.patch(`/orders/${orderId}/status`, payload);
            await onRefresh();
        } catch (err) {
            console.error("Error marking order completed:", err);
            alert("Failed to update order status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleMarkSubOrderCompleted = async (suborderid) => {
        try {
            setUpdatingSubOrderId(suborderid);
            const payload = { subOrderStatus: "COMPLETED" };
            await API.patch(`/orders/suborder/${suborderid}/status`, payload);
            setSelectedSubOrders((prev) =>
                prev.map((row) =>
                    row.suborderid === suborderid
                        ? { ...row, status: "COMPLETED" }
                        : row
                )
            );
            await onRefresh();
        } catch (err) {
            console.error("Error updating suborder status:", err);
            alert("Failed to mark suborder completed");
        } finally {
            setUpdatingSubOrderId(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (!searchText) return true;
        const custName = (order.customerName || order.cname || order.customer || "").toString().toLowerCase();
        const custPhone = (order.customerPhone || order.cphone || "").toString().toLowerCase();
        const term = searchText.toLowerCase();
        return custName.includes(term) || custPhone.includes(term);
    });

    return (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-[#A79277] text-white p-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">{showCustomerColumns ? "All Orders" : "Recent Orders"}</h2>
                {showCustomerColumns ? (
                    <Input
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by name or phone"
                        className="max-w-xs bg-white text-[#1F2937]"
                    />
                ) : (
                    customerId ? (
                        <button
                            onClick={handleOpenOrderModal}
                            className="bg-white text-[#A79277] px-4 py-2 rounded-lg font-semibold hover:bg-[#f3eee7]"
                        >
                            New Order
                        </button>
                    ) : null
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="bg-[#EFE6DD]">
                        <tr>
                            {showCustomerColumns && (
                                <>
                                    <th className="text-left p-4">Customer Name</th>
                                    <th className="text-left p-4">Phone</th>
                                </>
                            )}
                            <th className="text-left p-4">Order Date</th>
                            <th className="text-left p-4">Amount</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => {
                            const id = order.orderid ?? order.id ?? order.orderId;
                            const status = order.orderStatus || order.status || "PENDING";
                            const isPending = status.toUpperCase() === "PENDING";
                            const amount = order.orderprice ?? order.amount ?? order.price ?? "-";
                            const date = order.orderdate ?? order.date ?? "-";
                            const custName = order.customerName ?? order.cname ?? order.customer ?? "-";
                            const custPhone = order.customerPhone ?? order.cphone ?? order.customerPhone ?? "-";

                            return (
                                <tr
                                    key={id}
                                    onClick={() => openOrderDetails(order)}
                                    className="border-b hover:bg-[#FAF7F0] cursor-pointer"
                                >
                                    {showCustomerColumns && (
                                        <>
                                            <td className="p-4">{custName}</td>
                                            <td className="p-4">{custPhone}</td>
                                        </>
                                    )}
                                    <td className="p-4">{(date + "").split('T')[0]}</td>
                                    <td className="p-4">{amount}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isPending ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {isPending ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkOrderCompleted(id);
                                                }}
                                                disabled={updatingOrderId === id}
                                                className="bg-[#A79277] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {updatingOrderId === id ? "Updating..." : "Order Completed"}
                                            </button>
                                        ) : (
                                            <span className="text-gray-600 text-sm">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Modal
                title={selectedOrder ? `Sub Orders for Order #${selectedOrder.id || selectedOrder.orderid || selectedOrder.orderId}` : "Sub Orders"}
                open={detailsModalOpen}
                onCancel={closeDetailsModal}
                footer={null}
                width={900}
                bodyStyle={{ maxHeight: "600px", overflowY: "auto" }}
            >
                {detailsLoading ? (
                    <div className="flex items-center justify-center py-12 text-[#A79277]">Loading sub orders...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] border border-[#E5E7EB]">
                                <thead className="bg-[#EFE6DD]">
                                    <tr>
                                        <th className="text-left p-4">Dress Type</th>
                                        <th className="text-left p-4">Quantity</th>
                                        <th className="text-left p-4">Member</th>
                                        <th className="text-left p-4">Price</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSubOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-6 text-center text-gray-600">
                                                No sub orders available.
                                            </td>
                                        </tr>
                                    ) : (
                                        selectedSubOrders.map((subOrder) => {
                                            const status = (subOrder.status || "NEW").toUpperCase();
                                            const isCompleted = status === "COMPLETED";

                                            return (
                                                <tr key={subOrder.suborderid || subOrder.id} className="border-b hover:bg-[#FAF7F0]">
                                                    <td className="p-4">{subOrder.typeofdress}</td>
                                                    <td className="p-4">{subOrder.quantity}</td>
                                                    <td className="p-4">{subOrder.memberName || getMemberName(subOrder.memberid)}</td>
                                                    <td className="p-4">{subOrder.price}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <button
                                                            onClick={() => handleMarkSubOrderCompleted(subOrder.suborderid)}
                                                            disabled={isCompleted || updatingSubOrderId === subOrder.suborderid}
                                                            className="bg-[#A79277] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {updatingSubOrderId === subOrder.suborderid ? "Updating..." : isCompleted ? "Completed" : "Order Completed"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4 justify-between bg-[#F5F1EC] p-4 rounded-lg">
                            <div>
                                <p className="text-gray-500 text-sm">Order Date</p>
                                <p className="text-lg font-semibold text-[#3B3A3A]">{getSelectedOrderDate()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Order Price</p>
                                <p className="text-lg font-semibold text-[#3B3A3A]">{getSelectedOrderTotal()}</p>
                            </div>
                        </div>
                    </>
                )}
            </Modal>

            <Modal
                title="Create New Order"
                open={orderModalOpen}
                onOk={handleCreateOrder}
                confirmLoading={orderLoading}
                onCancel={() => {
                    setOrderModalOpen(false);
                    setSubOrders([{ memberid: null, typeofdress: "", quantity: 1, price: 0 }]);
                    setSubOrderErrors({});
                }}
                okText="Create Order"
                cancelText="Cancel"
                width={900}
                bodyStyle={{ maxHeight: "600px", overflowY: "auto" }}
            >
                <Form layout="vertical">
                    <Divider>Sub Orders</Divider>

                    {subOrders.map((subOrder, index) => (
                        <div key={index} className="border border-[#D8C3A5] rounded-lg p-4 mb-4">
                            <Row gutter={16}>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Member">
                                        <Select
                                            placeholder="Select member"
                                            value={subOrder.memberid || undefined}
                                            onChange={(value) => {
                                                handleSubOrderChange(index, "memberid", value);
                                                if (subOrderErrors[index]?.memberid) {
                                                    setSubOrderErrors({
                                                        ...subOrderErrors,
                                                        [index]: { ...subOrderErrors[index], memberid: null }
                                                    });
                                                }
                                            }}
                                            status={subOrderErrors[index]?.memberid ? "error" : ""}
                                            options={members.map((m) => ({ label: m.mname, value: m.mid }))}
                                        />
                                        {subOrderErrors[index]?.memberid && (
                                            <p className="text-red-500 text-xs mt-1">{subOrderErrors[index].memberid}</p>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Type of Dress">
                                        <Input
                                            placeholder="e.g., Kurta"
                                            value={subOrder.typeofdress}
                                            onChange={(e) => {
                                                handleSubOrderChange(index, "typeofdress", e.target.value);
                                                if (subOrderErrors[index]?.typeofdress) {
                                                    setSubOrderErrors({
                                                        ...subOrderErrors,
                                                        [index]: { ...subOrderErrors[index], typeofdress: null }
                                                    });
                                                }
                                            }}
                                            status={subOrderErrors[index]?.typeofdress ? "error" : ""}
                                            className={subOrderErrors[index]?.typeofdress ? "border-red-500" : ""}
                                        />
                                        {subOrderErrors[index]?.typeofdress && (
                                            <p className="text-red-500 text-xs mt-1">{subOrderErrors[index].typeofdress}</p>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Quantity">
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="1"
                                            value={subOrder.quantity}
                                            onChange={(e) => {
                                                handleSubOrderChange(index, "quantity", parseInt(e.target.value) || 1);
                                                if (subOrderErrors[index]?.quantity) {
                                                    setSubOrderErrors({
                                                        ...subOrderErrors,
                                                        [index]: { ...subOrderErrors[index], quantity: null }
                                                    });
                                                }
                                            }}
                                            status={subOrderErrors[index]?.quantity ? "error" : ""}
                                            className={subOrderErrors[index]?.quantity ? "border-red-500" : ""}
                                        />
                                        {subOrderErrors[index]?.quantity && (
                                            <p className="text-red-500 text-xs mt-1">{subOrderErrors[index].quantity}</p>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item label="Price">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={subOrder.price}
                                            onChange={(e) => {
                                                handleSubOrderChange(index, "price", parseFloat(e.target.value) || 0);
                                                if (subOrderErrors[index]?.price) {
                                                    setSubOrderErrors({
                                                        ...subOrderErrors,
                                                        [index]: { ...subOrderErrors[index], price: null }
                                                    });
                                                }
                                            }}
                                            status={subOrderErrors[index]?.price ? "error" : ""}
                                            className={subOrderErrors[index]?.price ? "border-red-500" : ""}
                                        />
                                        {subOrderErrors[index]?.price && (
                                            <p className="text-red-500 text-xs mt-1">{subOrderErrors[index].price}</p>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            {subOrders.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSubOrder(index)}
                                    className="text-red-500 text-sm font-semibold hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddSubOrder}
                        className="bg-[#A79277] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#8E7A61] mb-6"
                    >
                        + Add Sub Order
                    </button>

                    <Divider />

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6} className="ml-auto">
                            <Form.Item label="Total Amount">
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={calculateTotal()}
                                    disabled
                                    className="font-bold text-lg"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}
