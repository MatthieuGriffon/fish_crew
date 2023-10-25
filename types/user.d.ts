export type User = {
    id : string | null;
    username: string | null;
    city: string | null;
    department: string | null;
    email: string | null;
    roleId: string | null;
    role : Role | null;
    spots: spot[] | null;
    groupMembers: groupMember[] | null;
    catches: catch[] | null;
    chats: chat[] | null;
  };

  export type Group = {
    id: string;
    name: string;
    description: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    spots: spot[];
    groupMembers: groupMember[];
    events: event[];
    chats: chat[];
  };


 