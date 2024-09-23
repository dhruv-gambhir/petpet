import NavBar from "../Components/NavBar";

export default function WebappLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
