export interface ITrainInfo {
  progress: {
    total: number;
    success: number;
  };
  status: string;
  lastUpdate: Date;
  nextActivityScheduledDate: Date;
}

export interface ICard {
  category: string;
  question: string;
  content: string;
  image?: number;
  hints?: string[];
  options?: string[];
  tags: string[];
  isFavorite: boolean;
  trainInfo?: ITrainInfo;
}
export interface ICards {
  [_id: string]: ICard;
}
