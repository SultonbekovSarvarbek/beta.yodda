export interface Story {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorPhoto: string;
  image: string;
  timestamp: Date;
  viewed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  timestamp: Date;
  likes: number;
}

export interface Post {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorPhoto: string;
  subject: string;
  verified: boolean;
  images: string[];
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  saved: boolean;
  liked: boolean;
}
