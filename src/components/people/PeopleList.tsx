import { listPeople } from "@/handlers/api/people.handler";
import { IPerson } from "@/types/person";
import React, { useEffect, useState } from "react";
import Loader from "../ui/loader";
import PersonItem from "./PersonItem";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "../ui/table";
import PersonBirthdayCell from "./PersonBirthdayCell";
import Link from "next/link";
import { ENV } from "@/config/environment";
import PersonHideCell from "./PersonHideCell";
import { PeoplePagination } from "./PeoplePagination";
import { useRouter } from "next/router";

const columns: ColumnDef<IPerson>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => <PersonItem person={row.original} />,
  },
  {
    header: "Birth Date",
    accessorKey: "birthDate",
    cell: ({ row }) => <PersonBirthdayCell person={row.original} />,
  },
  {
    header: "Hidden",
    accessorKey: "isHidden",
    cell: ({ row }) => (
      <PersonHideCell person={row.original} />
    ),
  },
  {
    header: "Link",
    accessorKey: "id",
    cell: ({ row }) => (
      <Link href={`${ENV.IMMICH_URL}/people/${row.original.id}`} target="_blank">
        View
      </Link>
    )
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => <span>{new Date(
      row.original.updatedAt
    ).toDateString()}</span>,
  },
];

export default function PeopleList() {
  const router = useRouter()
  const { page = 1 } = router.query as { page: string }
  const [people, setPeople] = useState<IPerson[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    return listPeople({
      page
    })
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

  useEffect(() => {
    if (!router.isReady) return;
    fetchData();
  }, [page]);



  if (loading) return <Loader />;
  if (errorMessage) return <div>{errorMessage}</div>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6  gap-4 p-2">
      {people.map((person) => (
        <PersonItem person={person} key={person.id}/>
      ))}
    </div>
  )
}
