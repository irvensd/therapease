import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  Plus,
  Search,
  Archive,
  Eye,
  Edit,
  Star,
  StarOff,
  Lock,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { NewNoteModal } from "@/components/modals/NewNoteModal";

const Notes = () => {
  const { toast } = useToast();
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);

  // Ultra-simple static data - no state, no computations
  const sampleNotes = [
    {
      id: 1,
      title: "Initial Assessment - Anxiety Treatment",
      client: "Emma Thompson",
      date: "Jan 22, 2024",
      type: "SOAP",
      status: "Complete",
      starred: true,
    },
    {
      id: 2,
      title: "Progress Review - Week 4",
      client: "Michael Chen",
      date: "Jan 21, 2024",
      type: "Progress",
      status: "Complete",
      starred: false,
    },
    {
      id: 3,
      title: "Crisis Intervention Session",
      client: "Sarah Johnson",
      date: "Jan 20, 2024",
      type: "BIRP",
      status: "Draft",
      starred: true,
    },
  ];

  // Simple handlers - no complex logic
  const handleViewNote = (note: any) => {
    toast({
      title: "View Note",
      description: `Viewing "${note.title}"`,
    });
  };

  const handleEditNote = (note: any) => {
    toast({
      title: "Edit Note",
      description: `Edit "${note.title}" - Coming soon!`,
    });
  };

  const handleStarNote = (note: any) => {
    toast({
      title: note.starred ? "Unstarred" : "Starred",
      description: `${note.title} ${note.starred ? "removed from" : "added to"} starred notes`,
    });
  };

  const getTypeColor = (type: string) => {
    if (type === "SOAP") return "bg-purple-100 text-purple-800";
    if (type === "BIRP") return "bg-green-100 text-green-800";
    if (type === "Progress") return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusColor = (status: string) => {
    if (status === "Complete") return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Session Notes</h1>
            <p className="text-muted-foreground">
              Create, manage, and organize your therapy session notes
            </p>
          </div>
          <Button onClick={() => setNewNoteModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Simple Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Total Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">notes created</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 draft</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                Starred
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">important notes</p>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">notes created</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Start a new session note with templates
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setNewNoteModalOpen(true)}
              >
                New Note
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Find notes by client, date, or content
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast({ title: "Search", description: "Search coming soon!" })
                }
              >
                Search
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                Archive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Secure storage for completed notes
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast({
                    title: "Archive",
                    description: "Archive coming soon!",
                  })
                }
              >
                View Archive
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notes List */}
        <Card className="therapease-card">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      {note.starred && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                      <Lock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {note.client} • {note.date}
                    </p>
                    <div className="flex gap-2">
                      <Badge
                        className={getTypeColor(note.type)}
                        variant="outline"
                      >
                        {note.type}
                      </Badge>
                      <Badge
                        className={getStatusColor(note.status)}
                        variant="outline"
                      >
                        {note.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStarNote(note)}
                    >
                      {note.starred ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewNote(note)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <NewNoteModal
        open={newNoteModalOpen}
        onOpenChange={setNewNoteModalOpen}
      />
    </Layout>
  );
};

export default Notes;
