import { Home, Image, User } from "lucide-react";


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
    title: "Statistics",
    link: "/statistics",
    icon: <Home className="h-4 w-4" />,
    badge: "Comming Soon"
  },
  {
    title: "Albums",
    link: "/albums",
    icon: <Home className="h-4 w-4" />,
    badge: "Comming Soon"
  },
];