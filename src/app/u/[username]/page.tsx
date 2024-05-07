'use client';

import React, { useState } from 'react';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

const specialChar = '||';

const splitMessage = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessages =
  'Messi or Ronaldo? || What is your Dream Job? || What is your comfort food?';

const sendMessage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessages,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessage = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setLoading] = useState(false);

  const {toast} = useToast()

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/send-message', {
        ...data,
        username,
      });
      toast: ({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestedMessages = async () => {
    try {
      complete('');
    } catch (err) {
      console.error('Error fetching Messages', err);
    }
  };

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className='text-4xl font-bold mb-6 text-center'>
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Write your anonymous message here'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button type='submit' disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className='space-y-4 my-8'>
        <div className='space-y-2'>
          <Button
            onClick={suggestedMessages}
            className='my-4'
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className='text-xl font-semibold'>Messages</h3>
          </CardHeader>
          <CardContent className='flex flex-col space-y-4'>
            {error ? (
              <p className='text-red-500'>{error.message}</p>
            ) : (
              splitMessage(completion).map((message, index) => (
                <Button
                  key={index}
                  variant='outline'
                  onClick={() => handleMessage(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className='my-6' />
      <div className='text-center'>
        <div className='mb-4'>Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default sendMessage;
