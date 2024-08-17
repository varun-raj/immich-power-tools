import { Inter } from "next/font/google";
import PeopleList from "@/components/people/PeopleList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <PeopleList />
  );
}
