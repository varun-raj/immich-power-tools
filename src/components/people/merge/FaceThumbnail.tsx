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
      {person.name ? (
        <p className="text-[12px]">{person.name}</p>
      ) : (
        <p className="text-[12px] italic text-gray-400">Untagged Person</p>
      )}
      
    </div>
  );
};

export default FaceThumbnail;
