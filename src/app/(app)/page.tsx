'use client';

import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import messages from '@/messages.json';
import AutoPlay from 'embla-carousel-autoplay'; //TO AUTOPLAY THE CAROUSEL
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SkeletonCard } from '@/components/skeleton/page';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return loading ? (
    <div className='flex justify-center items-center min-h-screen'>
      <SkeletonCard />
    </div>
  ) : (
    <div>
      <main className='flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-3xl md:text-5xl font-bold'>
            Dive into the World of Anonymous Conversations
          </h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>
            Explore Mystry Message - Where your identity remains a secret
          </p>
        </section>
        <Carousel
          plugins={[AutoPlay({ delay: 3000 })]}
          className='w-full max-w-xs'
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className='p-1'>
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className='flex aspect-square items-center justify-center p-6'>
                      <span className='text-lg font-semibold'>
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className='text-center p-4 md:p-6'>
        © 2024 Mystry Message. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
