import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  ExternalLink,
  AlertTriangle 
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  citations?: Array<{
    title: string;
    section: string;
    version: string;
  }>;
  timestamp: Date;
}

interface DocBotProps {
  sopVersion?: string;
}

export const DocBot = ({ sopVersion = "v1.2" }: DocBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I can help you with questions about our SOPs and procedures. All my answers are based on our official documentation. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock responses for demo
  const mockResponses: Record<string, { content: string; citations: Array<{title: string; section: string; version: string}> }> = {
    'fryer': {
      content: `Here are the steps to safely drain and filter deep fryer oil:

**Safety First:**
1. Ensure you're wearing heat-resistant gloves, apron, and closed shoes
2. Turn off heat and allow oil to cool to 60-70°C (never drain hot oil)

**Draining Process:**
3. Verify the drain valve is in closed position
4. Place the filter container under the drain valve
5. Slowly open the drain valve to control oil flow
6. Allow all oil to drain completely

**Filtering:**
7. Filter the oil through the manufacturer's recommended filter system
8. Remove any crumbs or debris during filtering
9. Close the drain valve securely
10. Refill to the MAX line with filtered oil

**Emergency Note:** If oil ignites, never use water. Use a Class K fire extinguisher and immediately cut power.`,
      citations: [
        { title: 'Deep Fryer Safety & Maintenance', section: 'Section 3: Draining & Filtering', version: 'v1.2' },
        { title: 'Deep Fryer Safety & Maintenance', section: 'Section 1: PPE Requirements', version: 'v1.2' },
        { title: 'Emergency Procedures', section: 'Oil Fire Response', version: 'v1.1' }
      ]
    },
    'allergen': {
      content: `To prevent allergen cross-contact in F&B operations:

**Equipment Separation:**
- Use dedicated cutting boards color-coded by allergen risk
- Maintain separate utensils for each allergen category
- Never use the same fryer oil for different allergen groups

**Preparation Areas:**
- Designate specific prep areas for high-risk allergens (nuts, shellfish)
- Clean and sanitize surfaces between different food preparations
- Use separate storage containers with clear labeling

**Hand Hygiene:**
- Wash hands thoroughly between handling different ingredients
- Change gloves when switching between allergen categories
- Use hand sanitizer as secondary protection, not replacement for washing

**Customer Communication:**
- Always inform customers of potential allergen presence
- Use the standardized allergen disclosure script
- Document special requests and communicate to kitchen staff`,
      citations: [
        { title: 'Food Allergen Basics', section: 'Cross-Contact Prevention', version: 'v1.1' },
        { title: 'Food Allergen Basics', section: 'Customer Disclosure Procedures', version: 'v1.1' }
      ]
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const inputLower = input.toLowerCase();
      let response: Message;

      if (inputLower.includes('fryer') || inputLower.includes('oil') || inputLower.includes('drain')) {
        response = {
          id: Date.now().toString() + '1',
          type: 'bot',
          content: mockResponses.fryer.content,
          citations: mockResponses.fryer.citations,
          timestamp: new Date()
        };
      } else if (inputLower.includes('allergen') || inputLower.includes('cross-contact') || inputLower.includes('allergy')) {
        response = {
          id: Date.now().toString() + '2',
          type: 'bot',
          content: mockResponses.allergen.content,
          citations: mockResponses.allergen.citations,
          timestamp: new Date()
        };
      } else {
        response = {
          id: Date.now().toString() + '3',
          type: 'bot',
          content: "I don't have specific information about that in our current SOPs. Please ask about deep fryer procedures, allergen management, equipment maintenance, or safety protocols. If you need information not covered in our SOPs, please contact your manager.",
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>DocBot Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">SOP {sopVersion}</Badge>
            <Badge variant="secondary" className="text-xs">
              Grounded Answers Only
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  </div>
                  
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Sources:
                      </div>
                      {message.citations.map((citation, index) => (
                        <div
                          key={index}
                          className="text-xs bg-muted/50 rounded p-2 border-l-2 border-primary"
                        >
                          <div className="font-medium">{citation.title}</div>
                          <div className="text-muted-foreground">{citation.section} • {citation.version}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t border-border p-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-warning-foreground">Safety Notice</div>
              <div className="text-muted-foreground">Always verify procedures with your manager for safety-critical operations.</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about procedures, safety protocols, equipment..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Try: "What are the steps to safely drain fryer oil?" or "How do I prevent allergen cross-contact?"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};