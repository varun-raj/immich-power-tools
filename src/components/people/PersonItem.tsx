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
import { ArrowUpRight } from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";
import { useToast } from "../ui/use-toast";

interface IProps {
  person: IPerson;
}
export default function PersonItem({ person }: IProps) {
  const { immichURL } = useConfig();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(person);

  const handleEdit = () => {
    if (formData.name && formData.name !== person.name) {
      setLoading(true);
      return updatePerson(person.id, {
        name: formData.name,
      })
        .then(() => {
          setEditMode(!editMode);
          toast({
            title: "Success",
            description: "Person updated successfully",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to update person",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setEditMode(!editMode);
    }
  };

  const handleHide = (hidden: boolean) => {
    setLoading(true);
    return updatePerson(person.id, {
      isHidden: hidden,
    })
      .then(() => {
        setFormData((person) => ({
          ...person,
          isHidden: hidden,
        }));
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className={clsx(
        "flex flex-col rounded-lg pb-2 border border-2 border-transparent items-center gap-2",
        {
          "opacity-50": formData.isHidden,
          "border border-blue-500": formData.name,
        }
      )}
    >
      <div className="relative w-full h-auto group">
        <div
          onClick={() => {
            handleHide(!formData.isHidden);
          }}
        >
          <Avatar
            className="w-full h-auto rounded-lg"
            src={person.thumbnailPath}
            alt={person.name}
          />
        </div>

        <div className="absolute top-2 left-2 group-hover:block hidden">
          <Link
            className="bg-green-300 block rounded-lg px-2 py-1 text-sm dark:text-gray-900"
            href={`${immichURL}/people/${person.id}`}
            target="_blank"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="absolute top-2 right-2 ">
          <PersonMergeDropdown person={person} />
        </div>
      </div>
      {!editMode ? (
        <h2
          className="text-lg text-center font-semibold hover:bg-gray-300 dark:hover:bg-gray-800 w-full px-2 py-1 rounded-lg"
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
          className="text-lg font-semibold text-center w-full px-2 py-1 rounded-lg"
          defaultValue={formData.name}
          placeholder="Enter name"
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
      <div className="flex flex-col gap-2">
        <PersonBirthdayCell person={person} />
      </div>
    </div>
  );
}
