import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  File, 
  Edit, 
  Trash2, 
  Download, 
  Search,
  Plus,
  Save,
  X,
  FileText,
  Image,
  Video,
  Music
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  uploadDate: Date;
  lastModified: Date;
}

export const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Food Safety Guidelines.pdf",
      type: "application/pdf",
      size: 2048576,
      uploadDate: new Date("2024-03-15"),
      lastModified: new Date("2024-03-15")
    },
    {
      id: "2", 
      name: "Kitchen Procedures.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 1024000,
      uploadDate: new Date("2024-03-10"),
      lastModified: new Date("2024-03-12")
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      const newFile: FileItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        lastModified: new Date()
      };

      // Read file content for text files
      if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFile.content = e.target?.result as string;
          setFiles(prev => [...prev, newFile]);
        };
        reader.readAsText(file);
      } else {
        setFiles(prev => [...prev, newFile]);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const startEdit = (file: FileItem) => {
    setEditingFile(file);
    setEditContent(file.content || "");
  };

  const saveEdit = () => {
    if (editingFile) {
      setFiles(prev => prev.map(file => 
        file.id === editingFile.id 
          ? { ...file, content: editContent, lastModified: new Date() }
          : file
      ));
      setEditingFile(null);
      setEditContent("");
    }
  };

  const cancelEdit = () => {
    setEditingFile(null);
    setEditContent("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (type.includes('text') || type.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">File Management</h2>
        <Badge variant="outline">{files.length} Files</Badge>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="w-5 h-5" />
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-base sm:text-lg font-medium mb-2">Drop files here or click to upload</p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Supports documents, images, videos, and text files
            </p>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        />
      </div>

      {/* File List */}
      <div className="grid gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {file.content !== undefined && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(file)}
                      className="flex-1 sm:flex-initial"
                    >
                      <Edit className="w-4 h-4 sm:mr-0" />
                      <span className="ml-2 sm:hidden">Edit</span>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                    <Download className="w-4 h-4 sm:mr-0" />
                    <span className="ml-2 sm:hidden">Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteFile(file.id)}
                    className="flex-1 sm:flex-initial"
                  >
                    <Trash2 className="w-4 h-4 sm:mr-0" />
                    <span className="ml-2 sm:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="truncate mr-2">Edit {editingFile.name}</span>
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] sm:min-h-[300px] resize-none text-sm"
                placeholder="File content..."
              />
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={cancelEdit} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={saveEdit} className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredFiles.length === 0 && searchTerm && (
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <Search className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-base sm:text-lg font-medium mb-2">No files found</p>
            <p className="text-sm sm:text-base text-muted-foreground">
              No files match your search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
