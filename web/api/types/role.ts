export interface Role {
  id: number;
  cnName: string;
  jpName: string;
  avatar: string;
  cnActor: string;
  jpActor: string;
  description: string;
  relationships: Relationship[];
  x?: number;
  y?: number;
  z?: number;
}

interface Relationship {
  targetId: number;
  // type: string;
}
