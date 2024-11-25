export interface CollectorInterface {
  id: number;
  slug: string;
  user: {
    fullName: string;
    profilePicture: string;
  },
  statistics: {
    donationsCount: number;
    donationsSum: number;
  },
  charity: {
    name: string;
  };
}
