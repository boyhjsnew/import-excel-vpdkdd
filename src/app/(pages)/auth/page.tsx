"use client";

import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import bgImage from "../../../assets/bg-4.png";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";

// Types cho APIc
interface LoginRequest {
  username: string;
  password: string;
  ma_dvcs: string;
}

interface LoginSuccessResponse {
  token: string;
}

interface LoginErrorResponse {
  error: string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoLoginLoading, setAutoLoginLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const router = useRouter();

  // Kiểm tra đăng nhập tự động khi component mount
  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    const savedToken = localStorage.getItem("authToken");

    if (savedUsername && savedPassword && savedToken) {
      // Có thông tin đăng nhập, thử đăng nhập tự động
      setAutoLoginLoading(true);

      try {
        const loginData: LoginRequest = {
          username: savedUsername,
          password: savedPassword,
          ma_dvcs: "VP",
        };

        const response = await fetch(
          "https://0313364566.minvoice.com.vn/api/Account/Login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          }
        );

        const data: LoginResponse = await response.json();

        if ("token" in data && data.token) {
          // Token vẫn hợp lệ, cập nhật token mới
          localStorage.setItem("authToken", data.token);

          toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: "Đăng nhập tự động thành công!",
            life: 2000,
          });

          setTimeout(() => {
            router.push("/home");
          }, 1000);
        } else {
          // Token không hợp lệ, xóa thông tin cũ
          localStorage.removeItem("authToken");
          localStorage.removeItem("username");
          localStorage.removeItem("password");
          localStorage.removeItem("ma_dvcs");

          toast.current?.show({
            severity: "warn",
            summary: "Phiên đăng nhập hết hạn",
            detail: "Vui lòng đăng nhập lại",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Auto login error:", error);
        // Lỗi kết nối, giữ nguyên thông tin đăng nhập
        toast.current?.show({
          severity: "warn",
          summary: "Không thể kết nối",
          detail: "Vui lòng kiểm tra kết nối mạng",
          life: 3000,
        });
      } finally {
        setAutoLoginLoading(false);
      }
    } else {
      // Không có thông tin đăng nhập
      setAutoLoginLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Vui lòng nhập đầy đủ tài khoản và mật khẩu",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const loginData: LoginRequest = {
        username: username.trim(),
        password: password.trim(),
        ma_dvcs: "VP",
      };

      const response = await fetch(
        "https://0313364566.minvoice.com.vn/api/Account/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data: LoginResponse = await response.json();

      // Kiểm tra response có token hay không
      if ("token" in data && data.token) {
        // Đăng nhập thành công
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("ma_dvcs", "VP");

        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: "Đăng nhập thành công!",
          life: 3000,
        });

        setTimeout(() => {
          router.push("/dashboard"); // hoặc trang bạn muốn chuyển đến
        }, 1000);
      } else if ("error" in data) {
        // Đăng nhập thất bại
        toast.current?.show({
          severity: "error",
          summary: "Lỗi đăng nhập",
          detail: data.error,
          life: 5000,
        });
      } else {
        // Response không đúng format
        toast.current?.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Phản hồi từ server không đúng định dạng",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Lỗi kết nối",
        detail: "Không thể kết nối đến server. Vui lòng thử lại sau.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Hiển thị loading khi đang kiểm tra đăng nhập tự động
  if (autoLoginLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Toast ref={toast} />

      {/* Left Section - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        ></div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg shadow-md p-7 bg-[#eff3f7]">
          {/* Logo */}

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI
          </h1>

          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tài khoản
              </label>
              <InputText
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tài khoản..."
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-black placeholder-gray-500"
                autoFocus
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <InputText
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập mật khẩu..."
                type="password"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-black placeholder-gray-500"
                disabled={loading}
              />
            </div>

            <Button
              label={loading ? "Đang đăng nhập..." : "Đăng nhập"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
              onClick={handleLogin}
              loading={loading}
              className="w-full p-3 bg-cyan-600 hover:bg-cyan-700 border-0 rounded-lg"
              size="large"
              disabled={loading}
            />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Cần hỗ trợ?{" "}
              <span className="text-cyan-600 font-medium">
                Liên hệ chúng tôi
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
