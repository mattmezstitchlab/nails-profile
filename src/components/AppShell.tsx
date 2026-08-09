import NavBar from "./NavBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:pl-56">
      <NavBar />
      <main className="pb-20 lg:pb-8">{children}</main>
    </div>
  );
}
