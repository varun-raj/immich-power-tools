import { IPersonListFilters } from "@/handlers/api/people.handler";
import { createContext, useContext } from "react";

interface IPeopleFilterContext extends IPersonListFilters {
  updateContext: (newConfig: Partial<IPersonListFilters>) => void;
}
const PeopleFilterContext = createContext<IPeopleFilterContext>({
  page: 1,
  updateContext: () => { },
})

export default PeopleFilterContext;

export const usePeopleFilterContext = () => {
  return useContext(PeopleFilterContext) as IPeopleFilterContext;
}