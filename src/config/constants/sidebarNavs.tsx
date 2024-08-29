import { GalleryVerticalEnd, Home, Image, LocateOff, User } from "lucide-react";

export const sidebarNavs = [
  {
    title: "Manage People",
    link: "/",
    icon: <User className="h-4 w-4" />,
  },
  {
    title: "Exif Analytics",
    link: "/analytics/exif",
    icon: <Image className="h-4 w-4" />,
  },
  {
    title: "Potential Albums",
    link: "/albums/potential-albums",
    icon: <GalleryVerticalEnd className="h-4 w-4" />,
  },
  {
    title: "Missing Locations",
    link: "/assets/missing-locations",
    icon: <LocateOff className="h-4 w-4" />,
  },
];
