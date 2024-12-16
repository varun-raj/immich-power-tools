import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IPerson } from "@/types/person";
import { useConfig } from "@/contexts/ConfigContext";

interface FaceThumbnailProps {
  person: IPerson;
  onSelect: (person: IPerson) => void;
  selected?: boolean;
}
const FaceThumbnail = ({ person, onSelect, selected }: FaceThumbnailProps) => {
  const { exImmichUrl } = useConfig();
  return (
    <div
      className={cn(
        " col-span-1 group flex flex-col items-center p-2 border-2 text-center rounded-lg dark:hover:bg-zinc-900 hover:bg-zinc-100 gap-2 justify-center",
        {
          "border-zinc-500": selected,
        }
      )}
      onClick={() => onSelect(person)}
    >
      <div className="relative">
        <Avatar
          src={person.thumbnailPath}
          alt={person.name}

          className="w-full h-full rounded-lg"
        />

        <p className="absolute text-[9px] top-1 right-1 bg-amber-300 px-1 text-zinc-900 rounded-lg group-hover:hidden">
          {person.similarity ? `${Math.round(person.similarity * 100)}%` : ""}
        </p>
      </div>

      {/* Make name or "Untagged Person" clickable to open the person's page */}
      <a
        href={`${exImmichUrl}/people/${person.id}`}
        className="text-[12px] cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
      >
        {person.name ? person.name : <span className="italic text-gray-400">Untagged Person</span>}
      </a>
    </div>
  );
};

export default FaceThumbnail;
