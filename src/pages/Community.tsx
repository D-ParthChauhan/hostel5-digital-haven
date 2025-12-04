import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Plus,
  Pin,
  Image,
  Send,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Subreddit {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  flair: string | null;
  is_pinned: boolean;
  created_at: string;
  author_id: string;
  subreddit_id: string;
  profiles?: { full_name: string; avatar_url: string | null };
  subreddits?: { name: string };
  vote_count?: number;
  comment_count?: number;
  user_vote?: number;
}

const Community = () => {
  const { user, isCouncil, isApproved } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState<string | null>(null);
  const [newSubredditName, setNewSubredditName] = useState("");
  const [newSubredditDesc, setNewSubredditDesc] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostFlair, setNewPostFlair] = useState("");
  const [isCreateSubredditOpen, setIsCreateSubredditOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isApproved) {
      return;
    }
    fetchSubreddits();
    fetchPosts();

    const channel = supabase
      .channel("posts-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isApproved]);

  const fetchSubreddits = async () => {
    const { data } = await supabase.from("subreddits").select("*").order("name");
    if (data) setSubreddits(data);
  };

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select(`
        *,
        subreddits(name)
      `)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (selectedSubreddit) {
      query = query.eq("subreddit_id", selectedSubreddit);
    }

    const { data } = await query;
    if (data) {
      // Fetch vote counts, user votes, and author info
      const postsWithVotes = await Promise.all(
        data.map(async (post) => {
          const { data: authorData } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", post.author_id)
            .maybeSingle();

          const { data: votes } = await supabase
            .from("votes")
            .select("vote_type")
            .eq("post_id", post.id);

          const { data: comments } = await supabase
            .from("comments")
            .select("id")
            .eq("post_id", post.id);

          const voteCount = votes?.reduce((acc, v) => acc + v.vote_type, 0) || 0;

          let userVote = 0;
          if (user) {
            const { data: userVoteData } = await supabase
              .from("votes")
              .select("vote_type")
              .eq("post_id", post.id)
              .eq("user_id", user.id)
              .maybeSingle();
            userVote = userVoteData?.vote_type || 0;
          }

          return {
            ...post,
            profiles: authorData || { full_name: "Unknown", avatar_url: null },
            vote_count: voteCount,
            comment_count: comments?.length || 0,
            user_vote: userVote,
          };
        })
      );
      setPosts(postsWithVotes);
    }
    setLoading(false);
  };

  const handleCreateSubreddit = async () => {
    if (!newSubredditName.trim()) return;

    const { error } = await supabase.from("subreddits").insert({
      name: newSubredditName.trim(),
      description: newSubredditDesc.trim() || null,
      created_by: user?.id,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Community created!" });
      setNewSubredditName("");
      setNewSubredditDesc("");
      setIsCreateSubredditOpen(false);
      fetchSubreddits();
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !selectedSubreddit) return;

    const { error } = await supabase.from("posts").insert({
      title: newPostTitle.trim(),
      content: newPostContent.trim() || null,
      flair: newPostFlair.trim() || null,
      subreddit_id: selectedSubreddit,
      author_id: user?.id,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Post created!" });
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostFlair("");
      setIsCreatePostOpen(false);
      fetchPosts();
    }
  };

  const handleVote = async (postId: string, voteType: number) => {
    if (!user) return;

    const existingVote = posts.find((p) => p.id === postId)?.user_vote;

    if (existingVote === voteType) {
      // Remove vote
      await supabase.from("votes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      // Upsert vote
      await supabase.from("votes").upsert(
        { post_id: postId, user_id: user.id, vote_type: voteType },
        { onConflict: "post_id,user_id" }
      );
    }
    fetchPosts();
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center mesh-gradient">
        <Card className="glass p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the community.
          </p>
          <Link to="/auth">
            <Button className="bg-gradient-hero">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center mesh-gradient">
        <Card className="glass p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Access Pending</h2>
          <p className="text-muted-foreground">
            Your account is pending approval by the hostel council. Please wait for approval to access the community.
          </p>
        </Card>
      </div>
    );
  }

  const flairColors: Record<string, string> = {
    announcement: "bg-red-500/20 text-red-500",
    question: "bg-blue-500/20 text-blue-500",
    discussion: "bg-green-500/20 text-green-500",
    meme: "bg-yellow-500/20 text-yellow-500",
    help: "bg-purple-500/20 text-purple-500",
  };

  return (
    <div className="min-h-screen pt-24 pb-12 mesh-gradient">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <Card className="glass sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Communities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedSubreddit === null ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedSubreddit(null);
                    fetchPosts();
                  }}
                >
                  <TrendingUp className="h-4 w-4 mr-2" /> All Posts
                </Button>
                {subreddits.map((sub) => (
                  <Button
                    key={sub.id}
                    variant={selectedSubreddit === sub.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedSubreddit(sub.id);
                      fetchPosts();
                    }}
                  >
                    #{sub.name}
                  </Button>
                ))}
                {isCouncil && (
                  <Dialog open={isCreateSubredditOpen} onOpenChange={setIsCreateSubredditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" /> Create Community
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass">
                      <DialogHeader>
                        <DialogTitle>Create New Community</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Community name"
                          value={newSubredditName}
                          onChange={(e) => setNewSubredditName(e.target.value)}
                        />
                        <Textarea
                          placeholder="Description (optional)"
                          value={newSubredditDesc}
                          onChange={(e) => setNewSubredditDesc(e.target.value)}
                        />
                        <Button onClick={handleCreateSubreddit} className="w-full bg-gradient-hero">
                          Create
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Create Post */}
            {selectedSubreddit && (
              <Card className="glass mb-6">
                <CardContent className="p-4">
                  <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                    <DialogTrigger asChild>
                      <div className="flex items-center gap-4 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                          <Plus className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <Input
                          placeholder="Create a post..."
                          className="bg-background/50 cursor-pointer"
                          readOnly
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="glass max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Title"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                        <Textarea
                          placeholder="What's on your mind?"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="min-h-[150px]"
                        />
                        <Input
                          placeholder="Flair (e.g., discussion, question, meme)"
                          value={newPostFlair}
                          onChange={(e) => setNewPostFlair(e.target.value)}
                        />
                        <Button onClick={handleCreatePost} className="w-full bg-gradient-hero">
                          <Send className="h-4 w-4 mr-2" /> Post
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="glass">
                    <CardContent className="p-6">
                      <div className="shimmer h-6 w-3/4 rounded mb-4" />
                      <div className="shimmer h-4 w-full rounded mb-2" />
                      <div className="shimmer h-4 w-2/3 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="glass">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">
                    {selectedSubreddit
                      ? "Be the first to post in this community!"
                      : "Select a community to start posting."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className={`glass transition-all hover:shadow-large ${
                      post.is_pinned ? "border-primary/50" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Vote buttons */}
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${post.user_vote === 1 ? "text-primary" : ""}`}
                            onClick={() => handleVote(post.id, 1)}
                          >
                            <ArrowBigUp className="h-6 w-6" />
                          </Button>
                          <span className="font-semibold">{post.vote_count || 0}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ${post.user_vote === -1 ? "text-destructive" : ""}`}
                            onClick={() => handleVote(post.id, -1)}
                          >
                            <ArrowBigDown className="h-6 w-6" />
                          </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            {post.is_pinned && (
                              <Pin className="h-4 w-4 text-primary" />
                            )}
                            <span>#{post.subreddits?.name}</span>
                            <span>•</span>
                            <span>Posted by {post.profiles?.full_name}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            {post.title}
                            {post.flair && (
                              <Badge
                                className={
                                  flairColors[post.flair.toLowerCase()] ||
                                  "bg-muted text-muted-foreground"
                                }
                              >
                                {post.flair}
                              </Badge>
                            )}
                          </h3>

                          {post.content && (
                            <p className="text-muted-foreground whitespace-pre-wrap mb-3">
                              {post.content}
                            </p>
                          )}

                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt="Post image"
                              className="rounded-lg max-h-96 object-cover mb-3"
                            />
                          )}

                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {post.comment_count} Comments
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Community;
