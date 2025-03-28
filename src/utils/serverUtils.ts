
export interface VideoServer {
  name: string;
  getter: (type: string, id: string, ss?: string, ep?: string) => string;
}

export const servers: VideoServer[] = [
  {
    name: "Videasy",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      type === "tv"
        ? `https://player.videasy.net/tv/${id}/${ss || 1}/${ep || 1}`
        : `https://player.videasy.net/movie/${id}`,
  },
  {
    name: "Vidzee",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      type === "tv"
        ? `https://vidzee.wtf/tv/${id}/${ss || 1}/${ep || 1}`
        : `https://vidzee.wtf/movie/${id}`,
  },
  {
    name: "Vidzee 4K",
    getter: (type: string, id: string,ss?: string, ep?: string) =>
      type === "movie" ? `https://vidzee.wtf/movie/4k/${id}` : `https://vidzee.wtf/tv/4k/${id}/${ss || 1}/${ep || 1}`,
  },
  {
    name: "Vidsrc Multiserver",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      type === "tv"
        ? `https://vidsrc.wtf/api/1/tv/?id=${id}&s=${ss || 1}&e=${ep || 1}`
        : `https://vidsrc.wtf/api/1/movie/?id=${id}`,
  },
  {
    name: "Vidsrc Multilang",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      type === "tv"
        ? `https://vidsrc.wtf/api/2/tv/?id=${id}&s=${ss || 1}&e=${ep || 1}`
        : `https://vidsrc.wtf/api/2/movie/?id=${id}`,
  },
  {
    name: "Vidsrc Multiembed",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      type === "tv"
        ? `https://vidsrc.wtf/api/3/tv/?id=${id}&s=${ss || 1}&e=${ep || 1}`
        : `https://vidsrc.wtf/api/3/movie/?id=${id}`,
  },
  {
    name: "Vidsrc 4K",
    getter: (type: string, id: string) =>
      type === "movie" ? `https://vidsrc.wtf/api/4/movie/?id=${id}` : "",
  },
  {
    name: "Vidsrc Premium",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      type === "tv"
        ? `https://vidsrc.wtf/api/5/tv/?id=${id}&s=${ss || 1}&e=${ep || 1}`
        : `https://vidsrc.wtf/api/5/movie/?id=${id}`,
  },
  {
    name: "Embed SU",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      `https://embed.su/embed/${type}/${id}${type === "tv" ? `/${ss || 1}/${ep || 1}` : ""}`,
  },
  {
    name: "VidSrc IN",
    getter: (type: string, id: string, ss?: string, ep?: string) =>
      `https://vidsrc.in/embed/${type}?tmdb=${id}${type === "tv" ? `&season=${ss || 1}&episode=${ep || 1}` : ""}`,
  },
];

