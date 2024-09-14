import { redirect } from "next/navigation";

export default function Home() {
  // if logged in redirect to profile 
  // else redirect to login

  // ideally redirect in a middleware or root layout.

  redirect('/login');


  return (
    <main>
      <p>Hello</p>
    </main>
  );
}
