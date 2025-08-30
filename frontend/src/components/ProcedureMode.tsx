import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  PlayCircle,
  PauseCircle
} from "lucide-react";

interface ProcedureStep {
  id: string;
  title: string;
  description: string;
  safety?: boolean;
  estimatedTime?: string;
  verification?: string;
  completed: boolean;
}

interface ProcedureModeProps {
  title?: string;
  version?: string;
  difficulty?: 'Easy' | 'Medium' | 'High';
}

export const ProcedureMode = ({ 
  title = "Deep Fryer Safety & Maintenance",
  version = "v1.2",
  difficulty = "Medium" 
}: ProcedureModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const [steps, setSteps] = useState<ProcedureStep[]>([
    {
      id: '1',
      title: 'Safety Equipment Check',
      description: 'Put on heat-resistant gloves, apron, and ensure you\'re wearing closed-toe shoes. Verify emergency stop and fire extinguisher locations.',
      safety: true,
      estimatedTime: '2 min',
      verification: 'Visual confirmation of PPE',
      completed: false
    },
    {
      id: '2', 
      title: 'Pre-Drain Oil Temperature',
      description: 'Turn off fryer heat and allow oil to cool to 60-70°C. Use thermometer to verify temperature is safe for draining.',
      safety: true,
      estimatedTime: '15-20 min',
      verification: 'Temperature reading 60-70°C',
      completed: false
    },
    {
      id: '3',
      title: 'Prepare Drain Container',
      description: 'Position the approved filter container directly under the drain valve. Ensure it\'s stable and can hold the full oil volume.',
      estimatedTime: '3 min',
      verification: 'Container properly positioned',
      completed: false
    },
    {
      id: '4',
      title: 'Open Drain Valve',
      description: 'Slowly open the drain valve to control oil flow rate. Never force or rush this process to prevent splashing.',
      safety: true,
      estimatedTime: '5-8 min',
      verification: 'Oil flowing at controlled rate',
      completed: false
    },
    {
      id: '5',
      title: 'Filter Oil',
      description: 'Using the manufacturer\'s filter system, remove all crumbs, debris, and particles from the oil.',
      estimatedTime: '10 min',
      verification: 'Oil visually clean and clear',
      completed: false
    },
    {
      id: '6',
      title: 'Clean Fryer Basin',
      description: 'Remove any remaining residue from the fryer basin. Clean with approved cleaning solution and rinse thoroughly.',
      estimatedTime: '8 min',
      verification: 'Basin visually clean and dry',
      completed: false
    },
    {
      id: '7',
      title: 'Refill with Clean Oil',
      description: 'Close drain valve securely, then refill fryer to MAX line with filtered oil. Do not exceed maximum capacity.',
      estimatedTime: '5 min',
      verification: 'Oil level between MIN-MAX marks',
      completed: false
    },
    {
      id: '8',
      title: 'Final Safety Check',
      description: 'Verify drain valve is completely closed, oil level is correct, and area is clean. Document completion time and date.',
      safety: true,
      estimatedTime: '3 min',
      verification: 'Manager approval required',
      completed: false
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;
  
  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const startProcedure = () => {
    setIsActive(true);
    setStartTime(new Date());
  };

  const pauseProcedure = () => {
    setIsActive(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentProcedureStep = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <p className="text-muted-foreground">Interactive Step-by-Step Procedure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{version}</Badge>
              <Badge variant={difficulty === 'High' ? 'destructive' : difficulty === 'Medium' ? 'default' : 'secondary'}>
                {difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Progress: {completedSteps} of {steps.length} steps completed
              </div>
              <div className="text-sm text-muted-foreground">
                {startTime && `Started: ${startTime.toLocaleTimeString()}`}
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex items-center space-x-2">
              {!isActive ? (
                <Button onClick={startProcedure} className="flex items-center space-x-2">
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Procedure</span>
                </Button>
              ) : (
                <Button onClick={pauseProcedure} variant="outline" className="flex items-center space-x-2">
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause</span>
                </Button>
              )}
              
              <Button
                onClick={previousStep}
                variant="outline"
                size="sm"
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              
              <Button
                onClick={nextStep}
                variant="outline"
                size="sm"
                disabled={currentStep === steps.length - 1}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Detail */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className={`${currentProcedureStep.safety ? 'border-warning bg-warning/5' : ''}`}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                {currentProcedureStep.safety && <AlertCircle className="w-5 h-5 text-warning" />}
                <CardTitle className="flex items-center space-x-2">
                  <span>Step {currentStep + 1}: {currentProcedureStep.title}</span>
                  {currentProcedureStep.completed && <CheckCircle2 className="w-5 h-5 text-success" />}
                </CardTitle>
              </div>
              {currentProcedureStep.safety && (
                <Badge variant="destructive" className="w-fit">
                  Safety Critical
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">{currentProcedureStep.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {currentProcedureStep.estimatedTime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Est. {currentProcedureStep.estimatedTime}</span>
                  </div>
                )}
              </div>
              
              {currentProcedureStep.verification && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Verification Required:</div>
                  <div className="text-sm text-muted-foreground">{currentProcedureStep.verification}</div>
                </div>
              )}
              
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id={`step-${currentProcedureStep.id}`}
                  checked={currentProcedureStep.completed}
                  onCheckedChange={() => handleStepComplete(currentProcedureStep.id)}
                />
                <label
                  htmlFor={`step-${currentProcedureStep.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  Mark as completed
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Step Overview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                      index === currentStep 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step.completed 
                        ? 'bg-success text-success-foreground' 
                        : index === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? <CheckCircle2 className="w-3 h-3" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${step.safety ? 'font-medium' : ''}`}>
                        {step.title}
                        {step.safety && <AlertCircle className="w-3 h-3 inline ml-1 text-warning" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {progressPercentage === 100 && (
            <Card className="border-success bg-success/5">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="font-medium text-success">Procedure Complete!</div>
                <div className="text-sm text-muted-foreground">All steps verified and completed</div>
                <Button className="mt-3 w-full" size="sm">
                  Submit Attestation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};