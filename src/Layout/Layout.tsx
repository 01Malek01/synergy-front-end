import Header from "@/components/Header/Header";

export default function Layout({ children }: any) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
