import { Inter } from "next/font/google";
import PeopleList from "@/components/people/PeopleList";
import PageLayout from "@/components/layouts/PageLayout";
import Header from "@/components/shared/Header";
import { PeoplePagination } from "@/components/people/PeoplePagination";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <PageLayout>
      <Header 
        leftComponent="Manage People" 
        rightComponent={
          <PeoplePagination />
        }
      />
      <PeopleList />
    </PageLayout>
  );
}
