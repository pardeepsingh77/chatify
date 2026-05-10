// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/
function BorderAnimatedContainer({ children }) {
  return (
    <div className="relative w-full h-full rounded-2xl p-[1px] overflow-hidden">
      <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(theme(colors.slate.600/.48)_80%,theme(colors.cyan.500)_86%,theme(colors.cyan.300)_90%,theme(colors.cyan.500)_94%,theme(colors.slate.600/.48))] animate-[spin_4s_linear_infinite]" />
      <div className="relative z-10 w-full h-full rounded-2xl bg-[linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)] flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
export default BorderAnimatedContainer;