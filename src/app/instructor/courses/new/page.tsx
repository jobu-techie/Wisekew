import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewCourseForm } from "./new-course-form";

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a new course</CardTitle>
          <CardDescription>
            You can add sections, lectures, and exams after creating it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewCourseForm />
        </CardContent>
      </Card>
    </div>
  );
}
