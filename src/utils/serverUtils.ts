
export interface VideoServer {
  name: string;
  getter: (type: string, id: string, ss?: string, ep?: string) => string;
}

export const servers: VideoServer[] = [
  {
    name: "Server 1",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      `https://embed.su/embed/${type}/${id}${
        type === "tv" ? `/${ss || 1}/${ep || 1}` : ""
      }`,
  },
  {
    name: "Server 2",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      `https://vidbinge.dev/embed/${type}/${id}${
        type === "tv" ? `/${ss || 1}/${ep || 1}` : ""
      }`,
  },
  {
    name: "Server 3",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      `https://vidsrc.cc/v2/embed/${type}/${id}${
        type === "tv" ? `/${ss || 1}/${ep || 1}` : ""
      }`,
  },
  {
    name: "Server 4",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      `https://vidsrc.in/embed/${type}?tmdb=${id}${
        type === "tv" ? `&season=${ss || 1}&episode=${ep || 1}` : ""
      }`,
  },
];
