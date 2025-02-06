import { useRouter } from "next/router";
import { useMemo } from "react";
import { Button, Input, Select } from "antd";
import { usePeopleFilterContext } from "@/contexts/PeopleFilterContext";

import { IPersonListFilters } from "@/handlers/api/people.handler";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function PeopleFilters() {
  const router = useRouter();
  const { updateContext, page, maximumAssetCount, type = "all", query = "", visibility = "all" } = usePeopleFilterContext();

  const handleChange = (data: Partial<IPersonListFilters>) => {
    updateContext(data);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...data,
        page: data.page || undefined,
        type: data.type || undefined,
        visibility: data.visibility || undefined,
        query: data.query || undefined,
        maximumAssetCount: data.maximumAssetCount || undefined,
        sort: data.sort || undefined,
        sortOrder: data.sortOrder || undefined,
      },
    });
  }
  const [nextPage, prevPage] = useMemo(() => {
    const pageNum = parseInt(page.toString() || "1", 10);
    return [pageNum + 1, pageNum - 1];
  }, [page]);

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Search by name"
        className="w-max"
        defaultValue={query}
        onChange={(e) => {
          handleChange({ query: e.target.value });
        }}
      />
      <Input
        type="number"
        placeholder="Max Asset Count"
        defaultValue={maximumAssetCount}
        onChange={(e) => {
          try {
            const value = parseInt(e.target.value || "0", 10);
            handleChange({ maximumAssetCount: value });
          } catch (e) {
            handleChange({ maximumAssetCount: 0 });
          }
        }}
      />



      <Select
        placeholder="Person Type"
        options={[
          { label: "All", value: "all" },
          { label: "Nameless", value: "nameless" },
          { label: "Named", value: "named" }]}
        onChange={(value) => handleChange({ type: value as "all" | "nameless" | "named" })}
      />

      <Select
        placeholder="Visibility"
        options={[
          { label: "All", value: "all" },
          { label: "Visible", value: "visible" },
          { label: "Hidden", value: "hidden" }]}
        onChange={(value) => handleChange({ visibility: value as "all" | "visible" | "hidden" })}
      />


      <div>
      <Button
        disabled={prevPage < 1}
        onClick={() => handleChange({ page: prevPage })}
        icon={<ArrowLeftOutlined />}
      />
      </div>

      <div>
      <Button 
        onClick={() => handleChange({ page: nextPage })}
        icon={<ArrowRightOutlined />}
      />
      </div>
      
      <Select 
        options={[
          { label: "Asset Count - ASC", value: "assetCountAsc" },
          { label: "Asset Count - DESC", value: "assetCountDesc" },
          { label: "Updated At - ASC", value: "updatedAtAsc" },
          { label: "Updated At - DESC", value: "updatedAtDesc" },
        ]}
        placeholder="Sort By"
        onChange={(value) => {
          switch (value) {
            case "assetCountAsc":
              handleChange({ sort: "assetCount", sortOrder: "asc" });
              break;
            case "assetCountDesc":
              handleChange({ sort: "assetCount", sortOrder: "desc" });
              break;
            case "updatedAtAsc":
              handleChange({ sort: "updatedAt", sortOrder: "asc" });
              break;
            case "updatedAtDesc":
              handleChange({ sort: "updatedAt", sortOrder: "desc" });
              break;
          }
        }}
      />

    </div>
  );
}
