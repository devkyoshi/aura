import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { InstructorSidebar } from '@/components/sidebar/instructor/inst-sidebar';
import { ModeToggle } from '@/components/navbar/mode_toggler';
import { Button } from '@/components/ui/button';
import { FolderPlus, Folders } from 'lucide-react';
import { ClassroomProvider } from '@/contexts/ClassroomContext';
import { Classrooms } from '@/app/dashboard/instructor/classrooms/Classrooms';

export default function CoursePage() {
  return (
    <SidebarProvider>
      <ClassroomProvider>
      <InstructorSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 pr-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>
                    <BreadcrumbPage>Classrooms</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <div className={'p-4 flex flex-row justify-between items-center'}>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Folders /> Classrooms
          </h1>
          <Button size={'sm'} className="text-white flex items-center gap-2">
            <FolderPlus  />
            <span className="hidden md:block">Create Classroom</span>
          </Button>
        </div>
        <Classrooms/>
      </SidebarInset>
      </ClassroomProvider>
    </SidebarProvider>
  )
}
