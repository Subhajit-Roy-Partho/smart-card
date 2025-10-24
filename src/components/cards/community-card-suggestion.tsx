'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollection, useFirebase, useMemoFirebase, useStorage } from '@/firebase';
import type { Card as CardType } from '@/lib/definitions';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useRef, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { Progress } from '../ui/progress';

export function CommunityCardSuggestion() {
  const { firestore, user } = useFirebase();
  const storage = useStorage();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSuggestPending, startSuggestTransition] = useTransition();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cardsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? collection(firestore, 'users', user.uid, 'credit_cards')
        : null,
    [firestore, user]
  );
  const { data: cards, isLoading } = useCollection<CardType>(cardsQuery);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    const fileId = `${user.uid}-${Date.now()}-${file.name}`;
    const sRef = storageRef(storage, `card-suggestions/${fileId}`);
    const uploadTask = uploadBytesResumable(sRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'Could not upload image. Please try again.',
        });
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setIsUploading(false);
          toast({
            title: 'Upload Complete',
            description: 'Image ready to be submitted.',
          });
        });
      }
    );
  };

  const handleSuggestCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to suggest a card.',
      });
      return;
    }

    const formData = new FormData(event.currentTarget);

    startSuggestTransition(async () => {
      try {
        const idToken = await user.getIdToken();
        // Manually set the imageUrl if it was uploaded
        if (imageUrl) {
            formData.set('card-image', imageUrl);
        }
        
        const response = await fetch('/api/suggest-card', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          toast({
            title: 'Success!',
            description: result.message,
          });
          formRef.current?.reset();
          setImageUrl('');
          if(fileInputRef.current) fileInputRef.current.value = '';
          setUploadProgress(0);
        } else {
          throw new Error(result.message || 'An unknown error occurred.');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
          variant: 'destructive',
          title: 'Submission Error',
          description: `Failed to suggest card: ${errorMessage}`,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Contributions</CardTitle>
        <CardDescription>
          Suggest new cards to the community or add benefits to your existing
          cards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add-benefit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-benefit">Add a Benefit</TabsTrigger>
            <TabsTrigger value="suggest-card">Suggest a Card</TabsTrigger>
          </TabsList>
          <TabsContent value="add-benefit" className="space-y-4 pt-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-card">Select a Card</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select name="select-card">
                    <SelectTrigger id="select-card">
                      <SelectValue placeholder="Choose a card..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cards?.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} ({card.last4})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefit-store">Store / Outlet</Label>
                <Input
                  id="benefit-store"
                  name="benefit-store"
                  placeholder="e.g., Starbucks, Amazon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefit-description">Benefit Details</Label>
                <Input
                  id="benefit-description"
                  name="benefit-description"
                  placeholder="e.g., 5% cashback, $10 coupon, 2x points"
                />
              </div>
              <Button>Add Benefit</Button>
            </form>
          </TabsContent>
          <TabsContent value="suggest-card" className="pt-4">
            <form ref={formRef} onSubmit={handleSuggestCard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Card Name</Label>
                <Input
                  id="card-name"
                  name="card-name"
                  placeholder="e.g., Ultimate Rewards Card"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-issuer">Issuer</Label>
                <Input 
                  id="card-issuer" 
                  name="card-issuer"
                  placeholder="e.g., Global Bank" 
                  required
                />
              </div>
              <input type="hidden" name="card-image" value={imageUrl} />

              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-2 pt-4">
                    <Label htmlFor="card-image-file">Card Background Image</Label>
                    <Input id="card-image-file" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} disabled={isUploading} />
                    {isUploading && <Progress value={uploadProgress} className="w-full" />}
                    {uploadProgress === 100 && imageUrl && <p className='text-sm text-green-600'>Upload successful!</p>}
                </TabsContent>
                <TabsContent value="url" className="space-y-2 pt-4">
                    <Label htmlFor="card-image-url">Background Image URL</Label>
                    <Input
                      id="card-image-url"
                      name="card-image-url"
                      placeholder="https://example.com/card-image.png"
                      onChange={(e) => setImageUrl(e.target.value)}
                      disabled={isUploading}
                    />
                </TabsContent>
              </Tabs>

              <Button type="submit" disabled={isSuggestPending || isUploading}>
                {(isSuggestPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Suggestion
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
