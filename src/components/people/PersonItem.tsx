import { IPerson } from "@/types/person";
import React, { useRef, useState } from "react";
import { Avatar } from "../ui/avatar";
import { mergePerson, searchPeople, updatePerson } from "@/handlers/api/people.handler";
import { PersonMergeDropdown } from "./PersonMergeDropdown";
import PersonBirthdayCell from "./PersonBirthdayCell";
import clsx from "clsx";
import Link from "next/link";
import { ArrowUpRight, Info, Search } from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import ShareAssetsTrigger from "../shared/ShareAssetsTrigger";
import { Autocomplete, AutocompleteOption } from "../ui/autocomplete";
import { AlertDialog, IAlertDialogActions } from "../ui/alert-dialog";
interface IProps {
  person: IPerson;
  onRemove: (person: IPerson) => void;
}
export default function PersonItem({ person, onRemove }: IProps) {
  const { exImmichUrl } = useConfig();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(person);
  const selectedPerson = useRef<AutocompleteOption | null>(null);
  const mergeDialogRef = useRef<IAlertDialogActions>(null);

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
      .catch(() => { })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMerge = async (option: AutocompleteOption) => {
    await mergePerson(person.id, [option.value]);
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
        <Avatar
          className="w-full min-h-full h-auto rounded-lg"
          src={person.thumbnailPath}
          alt={person.name}
        />
        <div className="absolute bottom-2 w-full flex justify-center items-center">
          <Badge variant={"secondary"} className="text-xs !font-medium font-mono">{person.assetCount} Assets</Badge>
        </div>
        <div className="absolute top-2 left-2 group-hover:flex hidden items-center gap-2">
          <Link
            className="bg-green-300 block rounded-lg px-2 py-1 text-sm dark:text-gray-900"
            href={`${exImmichUrl}/people/${person.id}`}
            target="_blank"
          >
            <ArrowUpRight size={16} />
          </Link>
          <Link
            className="bg-gray-300 block rounded-lg px-2 py-1 text-sm dark:text-gray-900"
            href={`/people/${person.id}`}
          >
            <Info size={16} />
          </Link>
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <PersonMergeDropdown person={person} onRemove={onRemove} />
          <Button variant="outline" className="!py-0.5 !px-2 text-xs h-7" onClick={() => {
            handleHide(!formData.isHidden);
          }}>
            {formData.isHidden ? "Show" : "Hide"}
          </Button>
          <ShareAssetsTrigger filters={{ personIds: [person.id] }} buttonProps={{ variant: "outline", className: "!py-0.5 !px-2 text-xs h-7" }} />
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
        <Autocomplete
          loadOptions={(query: string) => searchPeople(query).then((people) => people.map((person: any) => ({
            label: person.name, value: person.id,
            imageUrl: person.thumbnailPath
          })))}
          type="text"
          className="text-lg font-semibold text-center w-full px-2 py-1 rounded-lg"
          defaultValue={formData.name}
          placeholder="Enter name"
          autoFocus
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          value={formData.name}
          onOptionSelect={(value) => {
            mergeDialogRef.current?.open();
            selectedPerson.current = value;
          }}
          createNewLabel="Create"
          disabled={loading}
          onCreateNew={(value) => {
            handleEdit();
          }}
        />
      )}
      <div className="flex flex-col gap-2">
        <PersonBirthdayCell person={person} />
      </div>

      <AlertDialog
        ref={mergeDialogRef}
        title="Merge Person"
        description="Are you sure you want to merge this person with the selected person?"
        onConfirm={() => {
          if (selectedPerson.current) {
            handleMerge(selectedPerson.current);
          }
        }}
      />
    </div>
  );
}
