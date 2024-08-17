import { IPerson } from "@/types/person";
import React, { useState } from "react";
import { Avatar } from "../ui/avatar";
import { updatePerson } from "@/handlers/api/people.handler";
import { PersonMergeDropdown } from "./PersonMergeDropdown";

interface IProps {
  person: IPerson;
}
export default function PersonItem({ person }: IProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(person);

  const handleEdit = () => {
    setLoading(true);
    return updatePerson(person.id, {
      name: formData.name,
    })
      .then(() => {
        setEditMode(!editMode);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar
        className="w-12 h-12"
        src={person.thumbnailPath}
        alt={person.name}
      />
      {!editMode ? (
        <h2
          className="text-lg font-semibold"
          onClick={() => {
            setEditMode((prev) => !prev);
          }}
        >
          {formData.name ? formData.name : <span className="text-gray-400">Unknown</span>}
        </h2>
      ) : (
        <input
          type="text"
          className="text-lg font-semibold"
          defaultValue={formData.name}
          autoFocus
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          disabled={loading}
          onBlur={handleEdit}
        />
      )}
      <PersonMergeDropdown person={person} />
    </div>
  );
}
