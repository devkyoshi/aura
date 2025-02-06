'use client';

import { useClassroom } from '@/contexts/ClassroomContext';
import { toAbsoluteUrl } from '@/lib/utils';
import { Card, CardTitle,  CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

const tags = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
]

export const Classrooms = () => {

  const {classrooms, loading} = useClassroom();
  return (
 <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
   <div className="grid auto-rows-min gap-4 md:grid-cols-3">
     {loading ? (
       <>
         <div className="aspect-video rounded-xl bg-muted/50" />
         <div className="aspect-video rounded-xl bg-muted/50" />
         <div className="aspect-video rounded-xl bg-muted/50" />
       </>
     ) : (
       classrooms.map((classroom) => (

         <Card key={classroom.classroom_id} className={'p-2 hover:shadow-lg cursor-pointer hover:border-primary/50  transition-all duration-200'}>
           <CardContent className={'p-0'}>
             <img src={classroom.thumbnail || toAbsoluteUrl('/media/images/default-classroom.jpg')} alt="classroom" className="object-cover w-full h-full rounded-lg" />
           </CardContent>
           <div >
            <div className={'flex justify-between w-full mt-2'}>
              <CardTitle className="text-lg font-semibold text-primary">{classroom.title}</CardTitle>
            </div>
             <p className={'text-xs mt-2 text-gray-600 dark:text-white/60'}>{classroom.description || 'Join this classroom to explore new learning opportunities and enhance your skills!'}</p>
           </div>
           <div className={'mt-2'}>
          <div className={'flex flex-wrap gap-2 items-center'}>
            {tags?.map((tag, index) => (
              <Badge className={'items-center'} key={index} variant={'outline'}>{`#${tag}`}</Badge>
            ))}
          </div>
           </div>
           <hr className={'mt-4 mb-2'}/>
           <div className={'flex justify-between'}>
             <Badge variant={'outline'}>{classroom.category === 'O_LEVEL'? 'O/L': classroom.category === 'A_LEVEL'? 'A/L' : 'Other'}</Badge>
             <div className={'flex gap-2 items-center'}>
               <Badge>{classroom.students_enrolled?.length} Students</Badge>
               <Badge variant={'outline'} className={classroom.published? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}>{classroom.published ? 'Published' : 'Not Published'}</Badge>
               <Badge variant={'outline'} className={classroom.is_active? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}>{classroom.is_active ? 'Active' : 'Not Active'}</Badge>
             </div>
           </div>
         </Card>
       ))
     )}
   </div>
 </div>
  );
};
