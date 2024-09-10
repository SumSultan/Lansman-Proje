import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Image from "../assets/image.png"; // Resmi import edin

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_BE_URL;

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        sessionStorage.setItem("admin_token", token);
        navigate("/launches"); // Admin paneline yönlendirme
      } else {
        alert("Giriş başarısız");
      }
    } catch (error) {
      console.error("Login hatası:", error);
      alert("Giriş sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100 flex justify-center items-center">
        <img
          src={Image} // Burada import edilen resmi kullanın
          alt="Illustration"
          className="max-w-md"
        />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-3/4 max-w-sm">
          <div className="text-left mb-6">
            <h2 className="text-4xl font-semibold text-gray-800">
              Hoşgeldiniz
            </h2>
            <p className="text-gray-600">Hesabınıza giriş yapın</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                E-mail
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <div className="text-right">
                <a
                  href="#"
                  className="inline-block align-baseline font-bold text-sm text-red-500 hover:text-red-800"
                >
                  Şifremi Unuttum
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input className="mr-2 leading-tight" type="checkbox" />
                <span className="text-sm text-gray-600">Beni Hatırla</span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Giriş Yap
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
