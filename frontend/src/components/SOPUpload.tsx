import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Plus,
  X,
  Calendar,
  User,
  Building
} from "lucide-react";

interface SOPDocument {
  id: string;
  title: string;
  description: string;
  version: string;
  department: string;
  category: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  lastModified: Date;
  status: 'draft' | 'pending_approval' | 'approved' | 'archived';
  uploadedBy: string;
  approvedBy?: string;
  effectiveDate?: Date;
  reviewDate?: Date;
}

interface SOPUploadProps {
  userRole: 'crew' | 'manager';
  userName: string;
}

export const SOPUpload = ({ userRole, userName }: SOPUploadProps) => {
  const [sopDocuments, setSOPDocuments] = useState<SOPDocument[]>([
    {
      id: "1",
      title: "Food Safety Guidelines",
      description: "Comprehensive food safety procedures for kitchen operations",
      version: "2.1",
      department: "Kitchen",
      category: "Safety",
      fileName: "food-safety-guidelines-v2.1.pdf",
      fileSize: 2048576,
      uploadDate: new Date("2024-03-15"),
      lastModified: new Date("2024-03-15"),
      status: "approved",
      uploadedBy: "Manager Smith",
      approvedBy: "Regional Manager",
      effectiveDate: new Date("2024-03-20"),
      reviewDate: new Date("2024-09-20")
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    version: "",
    department: "",
    category: "",
    effectiveDate: "",
    reviewDate: ""
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const departments = ["Kitchen", "Front of House", "Management", "Cleaning", "Maintenance"];
  const categories = ["Safety", "Procedures", "Training", "Compliance", "Operations"];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('document') && !file.type.includes('text')) {
      alert('Please upload PDF, Word documents, or text files only.');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newSOP: SOPDocument = {
        id: Date.now().toString(),
        title: uploadForm.title || file.name.replace(/\.[^/.]+$/, ""),
        description: uploadForm.description,
        version: uploadForm.version || "1.0",
        department: uploadForm.department,
        category: uploadForm.category,
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        status: userRole === 'manager' ? 'approved' : 'pending_approval',
        uploadedBy: userName,
        effectiveDate: uploadForm.effectiveDate ? new Date(uploadForm.effectiveDate) : undefined,
        reviewDate: uploadForm.reviewDate ? new Date(uploadForm.reviewDate) : undefined
      };

      setSOPDocuments(prev => [newSOP, ...prev]);
      setIsUploading(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setUploadForm({
      title: "",
      description: "",
      version: "",
      department: "",
      category: "",
      effectiveDate: "",
      reviewDate: ""
    });
  };

  const updateSOPStatus = (id: string, status: SOPDocument['status']) => {
    setSOPDocuments(prev => prev.map(sop => 
      sop.id === id 
        ? { ...sop, status, approvedBy: status === 'approved' ? userName : undefined }
        : sop
    ));
  };

  const deleteSOP = (id: string) => {
    setSOPDocuments(prev => prev.filter(sop => sop.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: SOPDocument['status']) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft" },
      pending_approval: { variant: "outline" as const, label: "Pending Approval" },
      approved: { variant: "default" as const, label: "Approved" },
      archived: { variant: "destructive" as const, label: "Archived" }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SOP Management</h2>
        <Badge variant="outline">{sopDocuments.length} Documents</Badge>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New SOP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SOP Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">SOP Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Kitchen Safety Procedures"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                placeholder="e.g., 1.0, 2.1"
                value={uploadForm.version}
                onChange={(e) => setUploadForm(prev => ({ ...prev, version: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={uploadForm.department} onValueChange={(value) => setUploadForm(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={uploadForm.effectiveDate}
                onChange={(e) => setUploadForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewDate">Review Date</Label>
              <Input
                id="reviewDate"
                type="date"
                value={uploadForm.reviewDate}
                onChange={(e) => setUploadForm(prev => ({ ...prev, reviewDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the SOP content and purpose"
              value={uploadForm.description}
              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-lg font-medium">Uploading SOP...</p>
              </div>
            ) : (
              <>
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop SOP document here or click to upload</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports PDF, Word documents, and text files
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
        </CardContent>
      </Card>

      {/* SOP Documents List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">SOP Documents</h3>
        
        {sopDocuments.map((sop) => (
          <Card key={sop.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-lg">{sop.title}</h4>
                    {getStatusBadge(sop.status)}
                  </div>
                  
                  <p className="text-muted-foreground">{sop.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{sop.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{sop.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{sop.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>v{sop.version}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {sop.fileName} • {formatFileSize(sop.fileSize)} • Uploaded {sop.uploadDate.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {userRole === 'manager' && sop.status === 'pending_approval' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateSOPStatus(sop.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateSOPStatus(sop.id, 'archived')}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                  
                  {(userRole === 'manager' || sop.uploadedBy === userName) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSOP(sop.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
