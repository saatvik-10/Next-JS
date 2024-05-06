import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <div className='flex flex-col justify-center items-center space-y-3 bg-white'>
      <Skeleton className='h-[75px] w-[1200px] rounded-xl' />
      <Skeleton className='h-[25px] w-[500px] rounded-xl' />

      <div className='pt-10'>
        <Skeleton className='h-[390px] w-[313px] rounded-xl' />
      </div>
      <div className='pt-12'>
        <Skeleton className='h-7 w-[435px]' />
      </div>
    </div>
  );
}
