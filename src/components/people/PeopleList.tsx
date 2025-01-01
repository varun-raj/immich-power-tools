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
import { Button } from "@/components/ui/button";

export default function PeopleList() {
  const router = useRouter();
  const [people, setPeople] = useState<IPerson[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<IPersonListFilters>({
    ...router.query,
    page: 1,
    perPage: 20,
  });
  const [selectedPeople, setSelectedPeople] = useState<IPerson[]>([]);

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
      return p.id !== person.id
    }));
  }

  const handleSelect = (person: IPerson) => {
    const isSelected = selectedPeople.some((p) => p.id === person.id);
    if (isSelected) {
      setSelectedPeople(selectedPeople.filter((p) => p.id !== person.id));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const handleMerge = () => {
    // Implement the merge logic here
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchData();
  }, [filters]);


  const renderContent = () => {
    if (loading) return <Loader />;
    if (errorMessage) return <div>{errorMessage}</div>;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 p-2">
        {people.map((person) => (
          <div key={person.id} onClick={() => handleSelect(person)}>
            <PersonItem person={person} onRemove={handleRemove}/>
          </div>
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
      <PageLayout  className="!p-0 !mb-0">
        <Header
          leftComponent="Manage People"
          rightComponent={<PeopleFilters />}
        />
        <div className="flex justify-end p-2">
          <Button onClick={handleMerge} disabled={selectedPeople.length === 0}>
            Merge Selected People
          </Button>
        </div>
        {renderContent()}
      </PageLayout>
    </PeopleFilterContext.Provider>
  );
}
