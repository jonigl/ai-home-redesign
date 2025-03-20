import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import TransformedImage from "@/components/TransformedImage";
import StyleSelector from "@/components/StyleSelector";
import CustomInstructions from "@/components/CustomInstructions";
import TransformButton from "@/components/TransformButton";
import { TransformProvider } from "@/context/TransformContext";
import { Toaster } from "sonner";
// import { Vortex } from "./components/ui/vortex";
// import { useTheme } from "./components/theme-provider";

function App() {
  // const { theme } = useTheme();
  // const backgroundColor = theme === "dark" ? "#000000" : "#ffffff";
  return (
    <div className="bg-background min-h-screen w-screen">
      
      {/* <Vortex
        backgroundColor={backgroundColor}
        className="flex items-center flex-col justify-center md:px-10 py-4 w-full h-full"
      > */}
      <Toaster position="bottom-right" richColors />
      <TransformProvider>
        <div className="container max-w-7xl px-8 m-auto rounded-3xl bg-background/60 backdrop-blur-sm border mt-5">
          <Header />
          <main className="space-y-8 pb-20 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <ImageUploader />
              <TransformedImage />
            </div>

            <div className="space-y-6 w-full">
              <StyleSelector />
              <CustomInstructions />
            </div>

            <TransformButton />
          </main>
        </div>
      </TransformProvider>
      {/* </Vortex> */}
    </div>
  );
}

export default App;
