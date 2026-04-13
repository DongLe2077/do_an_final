'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined, ArrowUpOutlined } from '@ant-design/icons';
import useAuthStore from '@/store/authStore';
import nguoiDungService from '@/services/nguoiDungService';

const { Title, Text, Link } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await nguoiDungService.login(values);
      if (res.data.success) {
        login(res.data.data.user, res.data.data.token);
        message.success('Đăng nhập thành công!');
        router.push('/dashboard');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full page-fade-in">
      {/* Cột trái: Hình ảnh (Hero Section) */}
      <div 
        className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col justify-between p-12 text-white relative"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,21,41,0.85) 0%, rgba(0,21,41,0.4) 60%), url("/bg-login.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div>
          <div className="flex items-center gap-3 font-bold tracking-widest text-sm text-blue-100 uppercase mb-20">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <BankOutlined className="text-[#001529] text-lg" />
            </div>
            BQL CHUNG CƯ
          </div>

          <Title level={1} style={{ color: 'white', fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
            Quản Lý <br /> Chung Cư
          </Title>
          <p className="text-lg text-gray-200 max-w-md font-light leading-relaxed">
            Hệ thống quản lý thông minh kiến tạo không gian sống hiện đại và bền vững.
          </p>
        </div>

        <div className="flex gap-16 pb-8">
          <div>
            <div className="text-3xl font-extrabold mb-1">99%</div>
            <div className="text-xs uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-2">
              <CheckCircleOutlined className="text-blue-400" /> Độ tin cậy
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Form Đăng nhập */}
      <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#fafafa] flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <Title level={2} style={{ fontWeight: 700, color: '#1f2937', marginBottom: 8 }}>Đăng Nhập</Title>
            <Text type="secondary" className="text-gray-500 font-medium whitespace-nowrap">
              Chào mừng bạn trở lại hệ thống.
            </Text>
          </div>

          <Form name="login" onFinish={onFinish} layout="vertical" requiredMark={false}>
            <Form.Item
              label={<span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Tên đăng nhập</span>}
              name="TenDangNhap"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400 mr-2" />} 
                placeholder="Nhập tên đăng nhập" 
                size="large"
                className="rounded-lg bg-blue-50/50 border-blue-100 hover:border-blue-300 focus:border-blue-500 py-3" 
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Mật khẩu</span>}
              name="MatKhau"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400 mr-2" />} 
                placeholder="********" 
                size="large"
                className="rounded-lg bg-blue-50/50 border-blue-100 hover:border-blue-300 focus:border-blue-500 py-3" 
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6 mt-[-8px]">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-500 text-sm font-medium">Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Link className="text-sm font-semibold text-blue-600">Quên mật khẩu?</Link>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block
                className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg uppercase tracking-wide shadow-md"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Dummy icon for checking, wait I shouldn't just use missing imports
function CheckCircleOutlined({className}) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
