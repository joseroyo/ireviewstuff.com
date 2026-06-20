import Window from "@/components/Window";
import BackgroundMusic from "@/components/BackgroundMusic";

export default function Home() {
  return (
    <main className="px-5 container mx-auto flex flex-col items-center">
      <BackgroundMusic pageKey="Home" />
      <h1 className="text-[60px]">I REVIEW STUFF!!!</h1>
      <Window title="By Paul (ina) Cortes!" className="w-[50%] self-center mt-5">
        <h2>Hello!</h2>
        <p>Click on the tabs to see some of my reviews!</p>
      </Window>
    </main>
  );
}
