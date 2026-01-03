import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  documentType: string;
  status: "processing" | "completed" | "failed" | "pending";
  uploadedAt: string;
  analysisData?: {
    total?: number;
    date?: string;
    vendor?: string;
    period?: {
      start: string;
      end: string;
    };
    transactions?: Array<{
      date: string;
      description: string;
      amount: number;
    }>;
  };
}

interface DocumentListProps {
  limit?: number;
  showFilters?: boolean;
  compact?: boolean;
}

export function DocumentList({ 
  limit, 
  showFilters = true, 
  compact = false 
}: DocumentListProps) {
  const { data: documents, isLoading, error } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    refetchInterval: 10000, // Refresh every 10 seconds for status updates
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-timber-green" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-chart-4 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      failed: "destructive",
      processing: "secondary",
      pending: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getDocumentTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      "bank-statement": "🏦",
      "credit-card": "💳",
      loan: "🏠",
      "credit-report": "📊",
      investment: "📈",
      income: "💰",
      receipt: "🧾",
      invoice: "📄",
    };
    return icons[type] || "📄";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <XCircle className="w-12 h-12 mx-auto mb-2 text-destructive" />
            <p>Failed to load documents</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayDocuments = limit 
    ? (documents || []).slice(0, limit)
    : (documents || []);

  if (displayDocuments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 overflow-hidden">
              <img
                src="/mascot/timber_v5.png"
                alt="Timber"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your financial documents and let Timber analyze them for you!
            </p>
            <Button asChild>
              <a href="/upload">Upload Documents</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">
                    {getDocumentTypeIcon(doc.documentType)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusIcon(doc.status)}
                  {getStatusBadge(doc.status)}
                </div>
              </div>
            ))}
          </div>
          {documents && documents.length > (limit || 0) && limit && (
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/upload">View All Documents</a>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents ({displayDocuments.length})
          </span>
          <Button size="sm" asChild>
            <a href="/upload">Upload New</a>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getDocumentTypeIcon(doc.documentType)}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {doc.documentType.replace(/-/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      {getStatusBadge(doc.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    {doc.analysisData && (
                      <div className="text-sm">
                        {doc.analysisData.total && (
                          <p className="font-mono font-semibold">
                            ${doc.analysisData.total.toFixed(2)}
                          </p>
                        )}
                        {doc.analysisData.vendor && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {doc.analysisData.vendor}
                          </p>
                        )}
                        {doc.analysisData.period && (
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(doc.analysisData.period.start), "MMM d")} -{" "}
                            {format(new Date(doc.analysisData.period.end), "MMM d")}
                          </p>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Processing indicator */}
        {displayDocuments.some(doc => doc.status === "processing") && (
          <div className="mt-4 p-3 rounded-lg bg-timber-yellow/10 border border-timber-yellow/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                <img
                  src="/mascot/timber_v4.png"
                  alt="Timber"
                  className="w-full h-full object-cover animate-timber-bounce"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Timber is analyzing your documents...</p>
                <p className="text-xs text-muted-foreground">
                  This usually takes a few moments. Feel free to explore while you wait!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
