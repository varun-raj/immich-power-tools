import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IPerson } from "@/types/person";

interface FaceThumbnailProps {
  person: IPerson;
  onSelect: (person: IPerson) => void;
  selected?: boolean;
}
const FaceThumbnail = ({ person, onSelect, selected }: FaceThumbnailProps) => {
  return (
    <div
      className={cn(
        "col-span-1 flex flex-col items-center p-2 border-2 text-center rounded-lg hover:bg-zinc-900 gap-2 justify-center",
        {
          "border-zinc-500": selected,
        }
      )}
      onClick={() => onSelect(person)}
    >
      <Avatar
        src={person.thumbnailPath}
        alt={person.name}
        className="w-20 h-20"
      />
      {person.name ? (
        <p className="text-xs">{person.name}</p>
      ) : (
        <p className="text-xs italic text-gray-400">Untagged Person</p>
      )}
    </div>
  );
};

export default FaceThumbnail;
