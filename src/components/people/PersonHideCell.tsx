import { IPerson } from "@/types/person";
import React, { useState } from "react";
import { updatePerson } from "@/handlers/api/people.handler";

interface IProps {
  person: IPerson;
  onUpdate?: (person: IPerson) => any;
}

export default function PersonHideCell({ person, onUpdate }: IProps) {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(person.isHidden);

  const handleEdit = (hidden: boolean) => {
    setLoading(true);
    return updatePerson(person.id, {
      isHidden: hidden,
    })
      .then(() => {
        setHidden(hidden);
        onUpdate?.({
          ...person,
          isHidden: hidden,
        })
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <button
      onClick={() => handleEdit(!hidden)}
      className="bg-gray-200 rounded-lg px-2 py-1 text-sm border-0"
    >
      {hidden ? "Show" : "Hide"}
    </button>
  );
}
