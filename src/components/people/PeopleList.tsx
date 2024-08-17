import { listPeople } from "@/handlers/api/people.handler";
import { IListData } from "@/types/common";
import { IPerson } from "@/types/person";
import React, { useEffect, useState } from "react";
import Loader from "../ui/loader";
import PersonItem from "./PersonItem";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "../ui/table";
import PersonBirthdayCell from "./PersonBirthdayCell";

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
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => <span>{new Date(
      row.original.updatedAt
    ).toDateString()}</span>,
  },
];



export default function PeopleList() {
  const [people, setPeople] = useState<IPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    return listPeople()
      .then((response) => {
        setPeople(response.people);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;

  if (errorMessage) return <div>{errorMessage}</div>;

  return (
    <div>
      <div className="flex flex-col gap-2">
      <Table<IPerson> columns={columns} data={people} />
      </div>
    </div>
  );
}
