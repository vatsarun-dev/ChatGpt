import logo from "../assets/logo.svg";
import { TextShimmer } from "./TextShimmer.jsx";

const PageLoader = ({ text = "Loading workspace..." }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#080808] px-4 text-white">
      <img src={logo} alt="ChatGPT Logo" className="h-14 w-14 animate-pulse" />
      <TextShimmer
        className="text-sm font-medium text-zinc-200"
        duration={1.6}
        baseColor="#71717a"
        shimmerColor="#ffffff"
      >
        {text}
      </TextShimmer>
    </main>
  );
};

export default PageLoader;
