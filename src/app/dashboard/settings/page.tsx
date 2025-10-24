
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { testAiConnection } from '@/actions/test-ai';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { PersonalCards } from '@/components/settings/personal-cards';
import { RoleManager } from '@/components/settings/role-manager';

type TestState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  message: string;
};

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [testResult, setTestResult] = useState<TestState>({ status: 'idle', message: '' });

  const handleTestConnection = async () => {
    setTestResult({ status: 'pending', message: 'Testing connection...' });
    const result = await testAiConnection();
    setTestResult(result);
  };

  // In a real app, you would save these values securely
  const handleSave = () => {
    console.log('API Key:', apiKey);
    console.log('Server URL:', serverUrl);
    alert('Settings saved! (Check console)');
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>
      <RoleManager />
      <PersonalCards />
      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>
            Configure your OpenAI compatible API provider for GenAI features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input 
              id="api-key" 
              type="password" 
              placeholder="sk-..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="server-url">Server URL</Label>
            <Input
              id="server-url"
              placeholder="https://api.example.com/v1"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
            />
          </div>
           {testResult.status !== 'idle' && (
            <Alert variant={testResult.status === 'error' ? 'destructive' : 'default'}>
              {testResult.status === 'pending' && <Loader2 className="h-4 w-4 animate-spin" />}
              {testResult.status === 'success' && <CheckCircle className="h-4 w-4" />}
              {testResult.status === 'error' && <XCircle className="h-4 w-4" />}
              <AlertTitle>
                {testResult.status === 'pending' && 'Testing...'}
                {testResult.status === 'success' && 'Connection Successful'}
                {testResult.status === 'error' && 'Connection Failed'}
              </AlertTitle>
              <AlertDescription>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline" onClick={handleTestConnection} disabled={testResult.status === 'pending'}>
            {testResult.status === 'pending' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Connection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
