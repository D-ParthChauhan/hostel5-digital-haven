-- Create role enum
CREATE TYPE public.app_role AS ENUM ('council', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  room_number TEXT,
  phone TEXT,
  batch TEXT,
  branch TEXT,
  avatar_url TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE(user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_approved(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_approved FROM public.profiles WHERE id = _user_id), false)
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Council can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'council'));

CREATE POLICY "Council can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'council'));

CREATE POLICY "Council can update profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'council'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Council can delete profiles" ON public.profiles
  FOR DELETE USING (public.has_role(auth.uid(), 'council'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Council can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'council'));

-- Community: Subreddits
CREATE TABLE public.subreddits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Community: Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subreddit_id UUID REFERENCES public.subreddits(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  flair TEXT,
  is_pinned BOOLEAN DEFAULT false,
  is_poll BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Community: Poll options
CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  votes INTEGER DEFAULT 0
);

-- Community: Poll votes
CREATE TABLE public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(poll_option_id, user_id)
);

-- Community: Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Community: Votes (upvotes/downvotes)
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  UNIQUE(post_id, user_id),
  UNIQUE(comment_id, user_id)
);

-- User reputation
CREATE TABLE public.user_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  reputation INTEGER DEFAULT 0
);

-- Enable RLS on community tables
ALTER TABLE public.subreddits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;

-- Subreddits policies
CREATE POLICY "Anyone can view subreddits" ON public.subreddits
  FOR SELECT USING (public.is_approved(auth.uid()));

CREATE POLICY "Council can manage subreddits" ON public.subreddits
  FOR ALL USING (public.has_role(auth.uid(), 'council'));

-- Posts policies
CREATE POLICY "Approved users can view posts" ON public.posts
  FOR SELECT USING (public.is_approved(auth.uid()));

CREATE POLICY "Approved users can create posts" ON public.posts
  FOR INSERT WITH CHECK (public.is_approved(auth.uid()) AND auth.uid() = author_id);

CREATE POLICY "Authors can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Council can manage all posts" ON public.posts
  FOR ALL USING (public.has_role(auth.uid(), 'council'));

CREATE POLICY "Authors can delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Approved users can view comments" ON public.comments
  FOR SELECT USING (public.is_approved(auth.uid()));

CREATE POLICY "Approved users can create comments" ON public.comments
  FOR INSERT WITH CHECK (public.is_approved(auth.uid()) AND auth.uid() = author_id);

CREATE POLICY "Authors can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'council'));

-- Votes policies
CREATE POLICY "Approved users can vote" ON public.votes
  FOR ALL USING (public.is_approved(auth.uid()));

-- Poll options policies
CREATE POLICY "Approved users can view poll options" ON public.poll_options
  FOR SELECT USING (public.is_approved(auth.uid()));

CREATE POLICY "Council can manage poll options" ON public.poll_options
  FOR ALL USING (public.has_role(auth.uid(), 'council'));

-- Poll votes policies
CREATE POLICY "Approved users can vote on polls" ON public.poll_votes
  FOR ALL USING (public.is_approved(auth.uid()));

-- User reputation policies
CREATE POLICY "Anyone can view reputation" ON public.user_reputation
  FOR SELECT USING (public.is_approved(auth.uid()));

CREATE POLICY "System updates reputation" ON public.user_reputation
  FOR ALL USING (public.has_role(auth.uid(), 'council'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Handle new user signup - create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  INSERT INTO public.user_reputation (user_id, reputation)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for posts and comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;