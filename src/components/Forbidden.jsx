import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Forbidden = () => {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      {/* Dark mode toggle */}
      <div className="fixed top-6 right-6">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
        >
          <span className="material-symbols-outlined block dark:hidden">
            dark_mode
          </span>
          <span className="material-symbols-outlined hidden dark:block text-yellow-400">
            light_mode
          </span>
        </button>
      </div>

      <main className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-pattern">
        {/* Logo */}
        <div className="mb-12 flex items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-3xl">
              bolt
            </span>
          </div>
          <span className="text-3xl font-bold tracking-tight uppercase">
            FAF
          </span>
        </div>

        {/* Content */}
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150" />
            <div className="relative">
              <span className="material-symbols-outlined text-9xl text-primary opacity-20 dark:opacity-40">
                lock_person
              </span>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-4 rounded-full shadow-2xl">
                <span className="material-symbols-outlined text-5xl text-red-500">
                  block
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Bạn không có quyền truy cập
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Rất tiếc, bạn không có quyền xem nội dung này. Vui lòng kiểm tra lại
              tài khoản hoặc liên hệ quản trị viên.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              Quay lại trang chủ
            </button>

            <Link
              to="/signin"
              className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined">login</span>
              Đăng nhập ngay
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-8 w-full text-center px-6">
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
            <a className="hover:text-primary" href="#">
              Trung tâm trợ giúp
            </a>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <a className="hover:text-primary" href="#">
              Báo cáo sự cố
            </a>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <a className="hover:text-primary" href="#">
              Điều khoản
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            © 2024 FAF. Bảo lưu mọi quyền.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Forbidden;
