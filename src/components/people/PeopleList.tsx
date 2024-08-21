import { IPersonListFilters, listPeople } from "@/handlers/api/people.handler";
import { IPerson } from "@/types/person";
import React, { useEffect, useState } from "react";
import Loader from "../ui/loader";
import PersonItem from "./PersonItem";
import { PeopleFilters } from "./PeopleFilters";
import { useRouter } from "next/router";
import PeopleFilterContext from "@/contexts/PeopleFilterContext";
import PageLayout from "../layouts/PageLayout";
import Header from "../shared/Header";

export default function PeopleList() {
  const router = useRouter();
  const [people, setPeople] = useState<IPerson[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<IPersonListFilters>({
    page: 1,
  });

  
  const fetchData = async () => {
    setLoading(true);
    setErrorMessage(null);
    return listPeople(filters)
      .then((response) => {
        setPeople(response.people);
        setCount(response.total);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemove = (person: IPerson) => {
    setPeople((prev) => prev.filter((p) => {
      console.log(p.id, person.id, p.id !== person.id);
      return p.id !== person.id
    }));
  }

  useEffect(() => {
    if (!router.isReady) return;
    fetchData();
  }, [filters]);

  console.log(people.length);

  const renderContent = () => {
    if (loading) return <Loader />;
    if (errorMessage) return <div>{errorMessage}</div>;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6  gap-1 p-2">
        {people.map((person) => (
          <PersonItem person={person} key={person.id} onRemove={handleRemove}/>
        ))}
      </div>
    );
  };
  return (
    <PeopleFilterContext.Provider
      value={{
        ...filters,
        updateContext: (newConfig) =>
          setFilters((prev) => ({ ...prev, ...newConfig })),
      }}
    >
      <PageLayout>
        <Header
          leftComponent="Manage People"
          rightComponent={<PeopleFilters />}
        />
        {renderContent()}
      </PageLayout>
    </PeopleFilterContext.Provider>
  );
}
