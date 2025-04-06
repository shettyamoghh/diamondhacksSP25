import Image from "next/image";
import logoImage from "../assets/images/logosaas.png";
import MenuIcon from "../assets/icons/menu.svg";

export const Navbar = () => {
  return (
    <div className="bg-black">
      <div className="px-4">
        <div className="py-4 flex items-center justify-between">
          <div className="relative">
            <a href="" className="text-white text-3xl font-bold ml-5">
              RoadMapper
            </a>
          </div>
          <div className="border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden">
            <MenuIcon className="text-white" />
          </div>
          <nav className="text-white sm:flex gap-6 items-center hidden">
            <a
              href="#features"
              className="text-opacity-60 text-white hover:opacity-100 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-opacity-60 text-white hover:opacity-100 transition"
            >
              How It Works
            </a>
            <a
              href="#faqs"
              className="text-opacity-60 text-white hover:opacity-100 transition"
            >
              FAQs
            </a>
            <a href="/login">
              <button className="bg-white py-2 px-4 rounded-lg text-black">
                Get Started
              </button>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};
