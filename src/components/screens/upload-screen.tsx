'use client';

import React, { useState, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface UploadScreenProps {
  onAnalyze: (formData: FormData) => void;
}

const formSchema = z.object({
  url: z.string().optional(),
  file: z.any().optional(),
}).refine(data => data.url || data.file, {
  message: 'Please provide a URL or a file.',
  path: ['url'],
});

const UploadScreen: React.FC<UploadScreenProps> = ({ onAnalyze }) => {
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '', file: null },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    if (values.url) formData.append('url', values.url);
    if (values.file) formData.append('file', values.file);

    startTransition(() => {
      onAnalyze(formData);
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      form.setValue('file', files[0]);
      form.setValue('url', '');
      form.handleSubmit(onSubmit)();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      form.setValue('file', files[0]);
      form.setValue('url', '');
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full max-w-xl text-center animate-in fade-in duration-500">
      <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
        Detect Manipulation
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Analyze content authenticity using AI and source history.
      </p>

      <Tabs defaultValue="file" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">Upload Media</TabsTrigger>
          <TabsTrigger value="url">Paste URL</TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <Card
            className={cn(
              "border-2 border-dashed bg-card/50 transition-colors",
              isDragging ? "border-primary bg-muted" : "border-muted-foreground/30"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-4">
              <UploadCloud className="w-16 h-16 text-muted-foreground" />
              <div className="text-center">
                <p className="font-semibold">Drag & drop an image, video, or audio file</p>
                <p className="text-sm text-muted-foreground">or</p>
              </div>
              <Button type="button" variant="secondary" onClick={handleFileClick} disabled={isPending}>
                Browse File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,audio/*"
                disabled={isPending}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="url">
          <Card className="bg-card/50">
            <CardContent className="p-8 sm:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="https://example.com/media.jpg"
                              className="pl-10 h-12 text-base"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                form.setValue('file', null);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-base" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" /> : 'Analyze URL'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-dashed border-muted-foreground/30" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-sm text-muted-foreground italic">
            Your privacy is protected. Media is not stored.
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
