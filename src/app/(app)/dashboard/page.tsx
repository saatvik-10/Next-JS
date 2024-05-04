'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Message } from '@/model/User';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptMessagesSchema } from '@/schemas/accpetMessages';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { MessageCard } from '@/components/MessageCard/page';

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMsg = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api.accept-messages');
      setValue('accpetMessages', response.data.isAcceptingMessage);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ||
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ||
            'Failed to fetch message settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        accpetMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ||
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    }
  };

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied',
      description: 'Profile URL has been copied',
    });
  };
  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy your Unique Link</h2>
        <div className='flex items-center'>
          <input
            type='text'
            value={profileUrl}
            disabled
            className='input input-bordered w-full p-2 mr-2'
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className='mb-4'>
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />
      <Button
        className='mt-4'
        variant='outline'
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <RefreshCcw className='h-4 w-4' />
        )}
      </Button>
      <div className='mt-4 grid grip-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMsg}
            />
          ))
        ) : (
          <p>No Message to display</p>
        )}
      </div>
    </div>
  );
};

export default page;
