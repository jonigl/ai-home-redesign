import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import TransformedImage from "@/components/TransformedImage";
import StyleSelector from "@/components/StyleSelector";
import CustomInstructions from "@/components/CustomInstructions";
import TransformButton from "@/components/TransformButton";
import { TransformProvider } from "@/context/TransformContext";

function App() {
  return (
    <div className="bg-background min-h-screen w-screen">
      <TransformProvider>
        <div className="container max-w-7xl px-4 m-auto">
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
    </div>
  );
}

export default App;
