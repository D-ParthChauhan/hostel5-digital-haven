import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Shield,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  email: string;
  full_name: string;
  room_number: string | null;
  phone: string | null;
  batch: string | null;
  branch: string | null;
  avatar_url: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  is_approved: boolean;
  role?: string;
}

const AdminStudents = () => {
  const { user, isCouncil } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    room_number: "",
    phone: "",
    batch: "",
    branch: "",
    emergency_contact: "",
    emergency_phone: "",
    role: "student",
  });

  useEffect(() => {
    if (!user || !isCouncil) {
      navigate("/");
      return;
    }
    fetchStudents();
  }, [user, isCouncil]);

  const fetchStudents = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name");

    if (profiles) {
      const studentsWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id)
            .maybeSingle();
          return { ...profile, role: roleData?.role || "student" };
        })
      );
      setStudents(studentsWithRoles);
    }
    setLoading(false);
  };

  const handleCreateStudent = async () => {
    if (!formData.email || !formData.password || !formData.full_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Create user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: formData.full_name,
        },
      },
    });

    if (authError) {
      toast({ title: "Error", description: authError.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    if (authData.user) {
      // Update profile with additional info
      await supabase
        .from("profiles")
        .update({
          room_number: formData.room_number || null,
          phone: formData.phone || null,
          batch: formData.batch || null,
          branch: formData.branch || null,
          emergency_contact: formData.emergency_contact || null,
          emergency_phone: formData.emergency_phone || null,
          is_approved: true,
        })
        .eq("id", authData.user.id);

      // Update role if council
      if (formData.role === "council") {
        await supabase
          .from("user_roles")
          .update({ role: "council" })
          .eq("user_id", authData.user.id);
      }
    }

    toast({ title: "Success", description: "Student account created!" });
    setIsCreateOpen(false);
    resetForm();
    fetchStudents();
    setIsSubmitting(false);
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        room_number: formData.room_number || null,
        phone: formData.phone || null,
        batch: formData.batch || null,
        branch: formData.branch || null,
        emergency_contact: formData.emergency_contact || null,
        emergency_phone: formData.emergency_phone || null,
      })
      .eq("id", editingStudent.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Update role
      await supabase
        .from("user_roles")
        .update({ role: formData.role as "council" | "student" })
        .eq("user_id", editingStudent.id);

      toast({ title: "Success", description: "Student updated!" });
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    }
    setIsSubmitting(false);
  };

  const handleToggleApproval = async (studentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: !currentStatus })
      .eq("id", studentId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: currentStatus ? "Access Revoked" : "Access Granted",
        description: currentStatus
          ? "Student can no longer access the portal"
          : "Student can now access the portal",
      });
      fetchStudents();
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      room_number: "",
      phone: "",
      batch: "",
      branch: "",
      emergency_contact: "",
      emergency_phone: "",
      role: "student",
    });
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      email: student.email,
      password: "",
      full_name: student.full_name,
      room_number: student.room_number || "",
      phone: student.phone || "",
      batch: student.batch || "",
      branch: student.branch || "",
      emergency_contact: student.emergency_contact || "",
      emergency_phone: student.emergency_phone || "",
      role: student.role || "student",
    });
  };

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isCouncil) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center mesh-gradient">
        <Card className="glass p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            Only council members can access this page.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 mesh-gradient">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient">Manage Students</h1>
            <p className="text-muted-foreground">Add, edit, and manage student access</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-hero glow-hover">
                <Plus className="h-4 w-4 mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Room Number</Label>
                  <Input
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    placeholder="A-101"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Batch</Label>
                  <Input
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="council">Council Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Name</Label>
                  <Input
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    placeholder="Parent/Guardian Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Phone</Label>
                  <Input
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
              <Button
                onClick={handleCreateStudent}
                className="w-full mt-4 bg-gradient-hero"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Student Account
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="glass mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="glass overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No students found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                              <User className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{student.full_name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.room_number || "-"}</TableCell>
                        <TableCell>{student.batch || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={student.role === "council" ? "default" : "secondary"}
                            className={student.role === "council" ? "bg-gradient-hero" : ""}
                          >
                            {student.role === "council" ? (
                              <Shield className="h-3 w-3 mr-1" />
                            ) : null}
                            {student.role === "council" ? "Council" : "Student"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={student.is_approved}
                              onCheckedChange={() =>
                                handleToggleApproval(student.id, student.is_approved)
                              }
                            />
                            {student.is_approved ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(student)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Student</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Full Name</Label>
                                  <Input
                                    value={formData.full_name}
                                    onChange={(e) =>
                                      setFormData({ ...formData, full_name: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Room Number</Label>
                                  <Input
                                    value={formData.room_number}
                                    onChange={(e) =>
                                      setFormData({ ...formData, room_number: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Phone</Label>
                                  <Input
                                    value={formData.phone}
                                    onChange={(e) =>
                                      setFormData({ ...formData, phone: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Batch</Label>
                                  <Input
                                    value={formData.batch}
                                    onChange={(e) =>
                                      setFormData({ ...formData, batch: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Branch</Label>
                                  <Input
                                    value={formData.branch}
                                    onChange={(e) =>
                                      setFormData({ ...formData, branch: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Role</Label>
                                  <Select
                                    value={formData.role}
                                    onValueChange={(value) =>
                                      setFormData({ ...formData, role: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="student">Student</SelectItem>
                                      <SelectItem value="council">Council Member</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Emergency Contact</Label>
                                  <Input
                                    value={formData.emergency_contact}
                                    onChange={(e) =>
                                      setFormData({ ...formData, emergency_contact: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Emergency Phone</Label>
                                  <Input
                                    value={formData.emergency_phone}
                                    onChange={(e) =>
                                      setFormData({ ...formData, emergency_phone: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                              <Button
                                onClick={handleUpdateStudent}
                                className="w-full mt-4 bg-gradient-hero"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Update Student
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStudents;
