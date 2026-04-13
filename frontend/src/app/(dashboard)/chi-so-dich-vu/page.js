'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Select, InputNumber, DatePicker, Space, Popconfirm, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';
import chiSoDichVuService from '@/services/chiSoDichVuService';
import dichVuService from '@/services/dichVuService';
import hoaDonService from '@/services/hoaDonService';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function ChiSoDichVuPage() {
  const [data, setData] = useState([]);
  const [dichVuList, setDichVuList] = useState([]);
  const [hoaDonList, setHoaDonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedDVType, setSelectedDVType] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => { fetchData(); fetchDichVu(); fetchHoaDon(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await chiSoDichVuService.getAll();
      setData(res.data?.data || []);
    } catch { message.error('Lỗi tải danh sách chỉ số'); }
    finally { setLoading(false); }
  };

  const fetchDichVu = async () => {
    try { const res = await dichVuService.getAll(); setDichVuList(res.data?.data || []); } catch {}
  };

  const fetchHoaDon = async () => {
    try { const res = await hoaDonService.getAll(); setHoaDonList(res.data?.data || []); } catch {}
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        NgayGhi: values.NgayGhi ? values.NgayGhi.format('YYYY-MM-DD') : undefined,
      };
      if (editingRecord) {
        await chiSoDichVuService.update(editingRecord.MaGhi, payload);
        message.success('Cập nhật chỉ số thành công');
      } else {
        await chiSoDichVuService.create(payload);
        message.success('Thêm chỉ số thành công');
      }
      setModalOpen(false); form.resetFields(); setEditingRecord(null);
      fetchData();
    } catch (error) { message.error(error.response?.data?.message || 'Thao tác thất bại'); }
  };

  const handleDelete = async (MaGhi) => {
    try {
      await chiSoDichVuService.delete(MaGhi);
      message.success('Xóa chỉ số thành công');
      fetchData();
    } catch (error) { message.error(error.response?.data?.message || 'Xóa thất bại'); }
  };

  const handleDVChange = (MaDichVu) => {
    const dv = dichVuList.find(d => d.MaDichVu === MaDichVu);
    setSelectedDVType(dv?.LoaiDichVu || null);
  };

  const columns = [
    { title: 'Mã ghi', dataIndex: 'MaGhi', key: 'MaGhi', width: 140 },
    { title: 'Dịch vụ', dataIndex: 'TenDichVu', key: 'TenDichVu' },
    { title: 'Mã HĐ', dataIndex: 'MaHoaDon', key: 'MaHoaDon', width: 140, ellipsis: true },
    { title: 'Chỉ số cũ', dataIndex: 'ChiSoLanGhiTruoc', key: 'ChiSoLanGhiTruoc', width: 110 },
    { title: 'Chỉ số mới', dataIndex: 'ChiSoHienTai', key: 'ChiSoHienTai', width: 110 },
    { title: 'Số lượng', dataIndex: 'SoLuong', key: 'SoLuong', width: 100 },
    {
      title: 'Ngày ghi', dataIndex: 'NgayGhi', key: 'NgayGhi', width: 110,
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Thao tác', key: 'actions', width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setEditingRecord(record);
            handleDVChange(record.MaDichVu);
            form.setFieldsValue({
              ...record,
              NgayGhi: record.NgayGhi ? dayjs(record.NgayGhi) : undefined,
            });
            setModalOpen(true);
          }}>Sửa</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.MaGhi)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}><BarChartOutlined /> Quản lý Chỉ số dịch vụ</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingRecord(null); setSelectedDVType(null); form.resetFields(); setModalOpen(true);
        }}>
          Thêm chỉ số
        </Button>
      </div>

      <div className="table-wrapper">
        <Table columns={columns} dataSource={data} rowKey="MaGhi" loading={loading} scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `Tổng ${t} bản ghi` }} />
      </div>

      <Modal title={editingRecord ? 'Sửa chỉ số' : 'Thêm chỉ số mới'} open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingRecord(null); form.resetFields(); setSelectedDVType(null); }}
        onOk={() => form.submit()} okText={editingRecord ? 'Cập nhật' : 'Thêm'} cancelText="Hủy">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="MaDichVu" label="Dịch vụ" rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
            <Select placeholder="Chọn dịch vụ" onChange={handleDVChange}
              options={dichVuList.map(d => ({ label: `${d.TenDichVu} (${d.LoaiDichVu === 1 ? 'Theo chỉ số' : 'Cố định'})`, value: d.MaDichVu }))} />
          </Form.Item>
          <Form.Item name="MaHoaDon" label="Hóa đơn">
            <Select allowClear placeholder="Liên kết hóa đơn"
              options={hoaDonList.map(h => ({ label: `${h.MaHoaDon} - Phòng ${h.SoPhong || '?'} - ${h.ThangThu || ''}`, value: h.MaHoaDon }))} />
          </Form.Item>
          {(selectedDVType === 1 || selectedDVType === null) && (
            <>
              <Form.Item name="ChiSoLanGhiTruoc" label="Chỉ số lần ghi trước">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập chỉ số cũ" />
              </Form.Item>
              <Form.Item name="ChiSoHienTai" label="Chỉ số hiện tại">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập chỉ số mới" />
              </Form.Item>
            </>
          )}
          {(selectedDVType === 2 || selectedDVType === null) && (
            <Form.Item name="SoLuong" label="Số lượng">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng" />
            </Form.Item>
          )}
          <Form.Item name="NgayGhi" label="Ngày ghi">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày ghi" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
