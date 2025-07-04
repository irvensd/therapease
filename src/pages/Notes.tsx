import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const Notes = () => {
  const [showMessage, setShowMessage] = useState("");

  // Extremely simple handlers that just set a message
  const handleClick = (action: string, item: string) => {
    setShowMessage(`${action}: ${item}`);
    setTimeout(() => setShowMessage(""), 2000);
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
          <Button onClick={() => handleClick("Create", "New Note")}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Message Display */}
        {showMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">{showMessage}</p>
          </div>
        )}

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
              <div className="text-2xl font-bold">5</div>
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
              <div className="text-2xl font-bold">4</div>
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
                onClick={() => handleClick("Action", "Create Note")}
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
                onClick={() => handleClick("Action", "Search Notes")}
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
                onClick={() => handleClick("Action", "View Archive")}
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
              {/* Note 1 */}
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">
                      Initial Assessment - Anxiety Treatment
                    </h3>
                    <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                    <Lock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Emma Thompson • Jan 22, 2024
                  </p>
                  <div className="flex gap-2">
                    <Badge
                      className="bg-purple-100 text-purple-800"
                      variant="outline"
                    >
                      SOAP
                    </Badge>
                    <Badge
                      className="bg-green-100 text-green-800"
                      variant="outline"
                    >
                      Complete
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("Star", "Initial Assessment")}
                  >
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("View", "Initial Assessment")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("Edit", "Initial Assessment")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Note 2 */}
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">
                      Progress Review - Week 4
                    </h3>
                    <Lock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Michael Chen • Jan 21, 2024
                  </p>
                  <div className="flex gap-2">
                    <Badge
                      className="bg-orange-100 text-orange-800"
                      variant="outline"
                    >
                      Progress
                    </Badge>
                    <Badge
                      className="bg-green-100 text-green-800"
                      variant="outline"
                    >
                      Complete
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("Star", "Progress Review")}
                  >
                    <StarOff className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("View", "Progress Review")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("Edit", "Progress Review")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Note 3 */}
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">
                      Crisis Intervention Session
                    </h3>
                    <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                    <Lock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sarah Johnson • Jan 20, 2024
                  </p>
                  <div className="flex gap-2">
                    <Badge
                      className="bg-green-100 text-green-800"
                      variant="outline"
                    >
                      BIRP
                    </Badge>
                    <Badge
                      className="bg-yellow-100 text-yellow-800"
                      variant="outline"
                    >
                      Draft
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("Star", "Crisis Intervention")}
                  >
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("View", "Crisis Intervention")}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick("Edit", "Crisis Intervention")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => handleClick("Create", "First Note")}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notes;
