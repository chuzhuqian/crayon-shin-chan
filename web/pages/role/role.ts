export interface Role {
  id: number;
  name: string;
  avatar: string;
  relationships: Relationship[];
}

interface Relationship {
  targetId: number;
  type: string;
}

const roles: Role[] = [
  {
    id: 1,
    name: '野原新之助',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 2,
        type: '亲子'
      },
      {
        targetId: 3,
        type: '亲子'
      }
    ]
  },
  {
    id: 2,
    name: '野原广志',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 1,
        type: '亲子'
      },
      {
        targetId: 3,
        type: '夫妻'
      }
    ]
  },
  {
    id: 3,
    name: '小山美芽',
    avatar: 'https://avatars.githubusercontent.com/u/69023475?v=4',
    relationships: [
      {
        targetId: 1,
        type: '亲子'
      },
      {
        targetId: 2,
        type: '夫妻'
      }
    ]
  }
]
export default roles