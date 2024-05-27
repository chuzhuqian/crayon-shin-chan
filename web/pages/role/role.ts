export interface Role {
  id: number;
  name: string;
  avatar: string;
  x?: number;
  y?: number;
  z?: number;
  relationships: Relationship[];
}

interface Relationship {
  targetId: number;
  // type: string;
}

const roles: Role[] = [
  {
    id: 1,
    name: '野原新之助',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 2
      },
      {
        targetId: 3
      },
      {
        targetId: 4
      },
      {
        targetId: 5
      }
    ]
  },
  {
    id: 2,
    name: '野原广志',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 1
      },
      {
        targetId: 3
      }
    ]
  },
  {
    id: 3,
    name: '小山美芽',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 1
      },
      {
        targetId: 2
      }
    ]
  },
  {
    id: 4,
    name: '野原小白',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 1
      }
    ]
  },
  {
    id: 5,
    name: '风间彻',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 1
      }
    ]
  }
]
export default roles