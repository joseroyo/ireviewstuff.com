import Window from "@/components/Window";

export default function NotFound() {
  return (
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <Window title="404" className="max-w-[748px] w-[100%] self-center mt-10" draggable>
        <div className="flex flex-col items-center gap-4">
          <h1>What are you doing here?!</h1>
          <p className="mt-[-20px]">I think you're lost! Use the tabs above to get back on track!</p>
        </div>
      </Window>
    </main>
  );
}