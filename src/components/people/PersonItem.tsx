import { IPerson } from "@/types/person";
import React, { useState } from "react";
import { Avatar } from "../ui/avatar";
import { updatePerson } from "@/handlers/api/people.handler";
import { PersonMergeDropdown } from "./PersonMergeDropdown";
import PersonBirthdayCell from "./PersonBirthdayCell";
import PersonHideCell from "./PersonHideCell";
import clsx from "clsx";
import Link from "next/link";
import { ENV } from "@/config/environment";

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
    <div
      className={clsx("flex flex-col rounded-lg pb-2 border border-2 border-transparent items-center gap-2", {
        "opacity-50": formData.isHidden,
        "border border-blue-500": formData.name,
      })}
    >
      <div className="relative w-full h-auto">
        <Avatar
          className="w-full h-auto rounded-lg"
          src={person.thumbnailPath}
          alt={person.name}
        />
        <div className="absolute top-2 left-2 ">
        <Link className="bg-green-300 rounded-lg px-2 py-1 text-sm" href={`${ENV.IMMICH_URL}/people/${person.id}`} target="_blank">
          View
          </Link>
        </div>
        <div className="absolute top-2 right-2 ">
          <PersonHideCell
            person={person}
            onUpdate={(newData) => {
              setFormData(newData);
            }}
          />
        </div>

      </div>
      {!editMode ? (
        <h2
          className="text-lg text-center font-semibold"
          onClick={() => {
            setEditMode((prev) => !prev);
          }}
        >
          {formData.name ? (
            formData.name
          ) : (
            <span className="text-gray-400">Unknown</span>
          )}
        </h2>
      ) : (
        <input
          type="text"
          className="text-lg font-semibold text-center"
          defaultValue={formData.name}
          autoFocus
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEdit();
            }
          }}
          disabled={loading}
          onBlur={handleEdit}
        />
      )}
      <PersonMergeDropdown person={person} />
      <PersonBirthdayCell person={person} />
    </div>
  );
}
