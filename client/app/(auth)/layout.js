
import TitleBar from '../Components/TitleBar';

export default function AuthLayout({ children }) {
  return (
    <>
      <TitleBar />
      {children}
    </>
  );
}
