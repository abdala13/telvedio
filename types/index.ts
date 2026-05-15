export interface Article {
  id: string;
  telegram_message_id: number;
  channel_username: string;
  category: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  image_url: string | null;
  telegram_link: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  view_count: number;
}

export interface SystemLog {
  id: string;
  level: string;
  message: string;
  source: string;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  hasMore: boolean;
}
