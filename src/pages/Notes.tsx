import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Search, Archive } from "lucide-react";
import { NewNoteModal } from "@/components/modals/NewNoteModal";

const Notes = () => {
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);

  return (
    <Layout>
      <div className="p-6 space-y-6">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Digital Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create structured notes with templates and tags
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setNewNoteModalOpen(true)}
              >
                Create Note
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-primary" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Quickly find notes by client, date, or content
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert(
                    "Advanced search coming soon! You'll be able to search by client name, date range, keywords, and treatment goals.",
                  );
                }}
              >
                Search Notes
              </Button>
            </CardContent>
          </Card>

          <Card className="therapease-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Archive className="mr-2 h-5 w-5 text-primary" />
                Archive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Secure storage for completed treatment notes
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert(
                    "Secure archive coming soon! All notes will be encrypted and stored with full HIPAA compliance for long-term retention.",
                  );
                }}
              >
                View Archive
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="therapease-card">
          <CardHeader>
            <CardTitle>Features in Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>HIPAA-compliant note templates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Voice-to-text integration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Automatic client linking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Treatment progress tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Encrypted cloud backup</span>
              </div>
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
