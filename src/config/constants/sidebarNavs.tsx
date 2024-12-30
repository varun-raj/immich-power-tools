import { Album, GalleryHorizontal, GalleryVerticalEnd, Home, Image, LocateOff, MapPin, MapPinX, Search, User } from "lucide-react";

export const sidebarNavs = [
  {
    title: "Find",
    link: "/find",
    icon: <Search className="h-4 w-4" />,
  },
  {
    title: "Manage People",
    link: "/",
    icon: <User className="h-4 w-4" />,
  },
  {
    title: "Analytics",
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
    icon: <MapPinX className="h-4 w-4" />,
  },
  {
    title: "Manage Albums",
    link: "/albums",
    icon: <GalleryHorizontal className="h-4 w-4" />,
  },
  {
    title: "Geo Heatmap",
    link: "/assets/geo-heatmap",
    icon: <MapPin className="h-4 w-4" />,
  }
  
];
