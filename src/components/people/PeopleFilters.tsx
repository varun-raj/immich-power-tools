import { useRouter } from "next/router";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, SortAsc, SortDesc } from "lucide-react";
import { usePeopleFilterContext } from "@/contexts/PeopleFilterContext";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

export function PeopleFilters() {
  const router = useRouter();
  const { updateContext, page, maximumAssetCount } = usePeopleFilterContext();

  const [nextPage, prevPage] = useMemo(() => {
    const pageNum = parseInt(page.toString() || "1", 10);
    return [pageNum + 1, pageNum - 1];
  }, [page]);

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        placeholder="Max Asset Count"
        defaultValue={maximumAssetCount}
        onChange={(e) => {
          try {
            const value = parseInt(e.target.value || "0", 10);
            updateContext({ maximumAssetCount: value });
          } catch (e) {
            updateContext({ maximumAssetCount: 0 });
          }
        }}
      />
      <div className="flex items-center gap-1">
        <Switch
          id="nameLessOnly"
          onCheckedChange={(checked) => {
            updateContext({ nameLessOnly: checked, page: 1 });
          }}
        />
        <Label className="text-nowrap" htmlFor="nameLessOnly">
          Show only Nameless
        </Label>
      </div>

      <Button
        disabled={prevPage < 1}
        onClick={() => updateContext({ page: prevPage })}
      >
        <ArrowLeft size={16} />
      </Button>

      <Button onClick={() => updateContext({ page: nextPage })}>
        <ArrowRight size={16} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"secondary"}
            onClick={() => updateContext({ page: nextPage })}
          >
            <SortDesc size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() =>
              updateContext({ sort: "assetCount", sortOrder: "asc" })
            }
          >
            <SortAsc size={16} />
            <span>Asset Count - ASC</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              updateContext({ sort: "assetCount", sortOrder: "desc" })
            }
          >
            <SortDesc size={16} />
            <span>Asset Count - DESC</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              updateContext({ sort: "updatedAt", sortOrder: "asc" })
            }
          >
            <SortAsc size={16} />
            <span>Updated At - ASC</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              updateContext({ sort: "updatedAt", sortOrder: "desc" })
            }
          >
            <SortDesc size={16} />
            <span>Updated At - DESC</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
