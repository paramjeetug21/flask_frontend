import creative from "../assets/serviceAssets/creativeprofile.png";
import coder from "../assets/serviceAssets/coder.jpg";
import { useNavigate } from "react-router-dom";
import BackgroundMarquee from "./BackgroundMarquee";

export default function DashBoardWithoutToken() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 1. FIXED BACKGROUND */}
      <BackgroundMarquee />

      {/* 2. LOGIN BUTTON */}
      <p
        onClick={() => navigate("/login")}
        className="absolute top-6 right-15 z-50 text-white font-light text-sm cursor-pointer hover:text-gray-300 transition-colors tracking-wide "
      >
        Login
      </p>

      {/* 3. SCROLLABLE CONTENT */}
      <div className="absolute inset-0 z-20 overflow-y-auto no-scrollbar">
        {/* === SECTION 1: HERO === */}
        <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-4 drop-shadow-lg">
            BUILD YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              PORTFOLIO
            </span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl font-light text-gray-100 mb-8 leading-relaxed drop-shadow-md">
            Create your own professional digital identity. Our application
            allows you to design, customize, and share your work with the world.
          </p>

          <div className="absolute bottom-10 animate-bounce opacity-80">
            <span className="text-xs uppercase tracking-widest text-white font-bold">
              Scroll Down
            </span>
          </div>
        </div>

        {/* === SECTION 2: WHY CHOOSE US (Light Blur Glass) === */}
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20">
          <h2 className="text-5xl font-bold mb-12 text-white drop-shadow-lg">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
            {/* CHANGED: Used 'bg-white/10' for very light transparency 
                and 'backdrop-blur-sm' for a light blur effect. 
                Added 'border-white/20' for a thin outline.
            */}
            <div className="p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-3">Fast</h3>
              <p className="font-light text-gray-200">
                Build your site in minutes, not days. Our optimized engine
                renders your portfolio instantly.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-3">Secure</h3>
              <p className="font-light text-gray-200">
                Your data is safe with our top-tier encryption and secure
                authentication standards.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-3">Responsive</h3>
              <p className="font-light text-gray-200">
                Looks great on mobile, tablet, and desktop. Design once, view
                flawlessly everywhere.
              </p>
            </div>
          </div>
        </div>

        {/* === SECTION 3: SERVICES (Smaller Images) === */}
        <div className="py-20 px-4 max-w-7xl mx-auto space-y-32">
          {/* Row 1: Creative */}
          <div className="flex flex-col md:flex-row items-center gap-12 ml-15">
            <div className="w-full md:w-1/2 flex justify-center">
              {/* CHANGED: Added 'max-w-sm' to reduce image size */}
              <img
                src={creative}
                alt="Creative Design"
                className="w-full max-w-sm h-auto rounded-2xl shadow-2xl border-4 border-white/1"
              />
            </div>
            <div className="w-full  md:w-1/2 text-white text-left ">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-6xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-6 ">
                Create Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Profile
                </span>
              </h3>
              <p className="text-lg font-light leading-relaxed drop-shadow-md">
                Unleash your inner artist. Select from our wide range of <br />
                creative templates designed to showcase photography
                <br /> art, and design work.
              </p>
            </div>
          </div>

          {/* Row 2: Coder */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="w-full md:w-1/2 flex justify-center mr-20 ">
              {/* CHANGED: Added 'max-w-sm' to reduce image size */}

              <img
                src={coder}
                alt="Coder Management"
                className="w-full max-w-sm h-auto rounded-2xl shadow-2xl border-4 border-white/1"
              />
            </div>
            <div className="w-full md:w-1/2  text-white text-left ml-50">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-6xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-6 ">
                Manage Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Portfolio
                </span>
              </h3>
              <p className="text-lg font-light leading-relaxed drop-shadow-md">
                Built for professionals. Easily update your projects, <br />{" "}
                manage your resume details, and highlight your technical skills.
              </p>
            </div>
          </div>
        </div>

        {/* === SECTION 4: VALUES (No Box - Big Word, Small Content) === */}
        <div className="py-32 px-4 flex flex-col items-center justify-center text-white space-y-24">
          {/* Mission */}
          <div className="text-center max-w-3xl">
            {/* Big Word */}
            <h4 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-6">
              mi
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                s
              </span>
              si
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                o
              </span>
              n
            </h4>
            {/* Small Content */}
            <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
              To empower individuals to take control of their digital narrative
              by providing accessible, beautiful, and professional tools for
              portfolio creation.
            </p>
          </div>

          {/* Vision */}
          <div className="text-center max-w-3xl">
            {/* Big Word */}
            <h4 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-6">
              vi
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                s
              </span>
              i
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                o
              </span>
              n
            </h4>
            {/* Small Content */}
            <p className="text-xl md:text-2xl font-light text-gray-200 leading-relaxed">
              A world where everyone, regardless of technical skill, can
              showcase their achievements and connect with opportunities
              globally.
            </p>
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="py-12 text-center border-t border-white/10 bg-white/1 backdrop-blur-md">
          <h2 className="text-2xl font-light text-white tracking-widest uppercase opacity-80">
            Thanks for Visiting
          </h2>
          <p className="text-gray-400 text-sm mt-4">
            © 2024 Your Portfolio App
          </p>
        </div>
      </div>

      {/* CSS TO HIDE SCROLLBAR */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>
    </div>
  );
}
