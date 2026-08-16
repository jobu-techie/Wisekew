import {
  addLectureAction,
  addSectionAction,
  deleteLectureAction,
  deleteSectionAction,
} from "@/lib/actions/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatDuration } from "@/lib/format";
import { Trash2 } from "lucide-react";

type Lecture = {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number | null;
};

type Section = {
  id: string;
  title: string;
  lectures: Lecture[];
};

export function SectionManager({
  courseId,
  sections,
}: {
  courseId: string;
  sections: Section[];
}) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">{section.title}</h3>
            <form action={deleteSectionAction.bind(null, courseId, section.id)}>
              <Button variant="ghost" size="sm" type="submit">
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {section.lectures.length > 0 && (
            <ul className="mb-3 space-y-1">
              {section.lectures.map((lecture) => (
                <li
                  key={lecture.id}
                  className="flex items-center justify-between rounded bg-muted/50 px-3 py-2 text-sm"
                >
                  <span>
                    {lecture.title}
                    {lecture.duration ? ` · ${formatDuration(lecture.duration)}` : ""}
                    {!lecture.videoUrl && (
                      <span className="ml-2 text-xs text-muted-foreground">(no video yet)</span>
                    )}
                  </span>
                  <form action={deleteLectureAction.bind(null, courseId, lecture.id)}>
                    <Button variant="ghost" size="sm" type="submit">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          )}

          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">+ Add lecture</summary>
            <form
              action={addLectureAction.bind(null, courseId, section.id)}
              className="mt-3 space-y-3"
            >
              <div className="space-y-1.5">
                <Label>Lecture title</Label>
                <Input name="title" required />
              </div>
              <div className="space-y-1.5">
                <Label>Video URL (YouTube/Vimeo/mp4 link) — optional if uploading a file</Label>
                <Input name="videoUrl" placeholder="https://..." />
              </div>
              <div className="space-y-1.5">
                <Label>Or upload a video file</Label>
                <Input name="videoFile" type="file" accept="video/*" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Duration (seconds)</Label>
                  <Input name="duration" type="number" min={0} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Notes / text content (optional)</Label>
                <Textarea name="content" rows={2} />
              </div>
              <Button type="submit" size="sm">
                Add lecture
              </Button>
            </form>
          </details>
        </div>
      ))}

      <Separator />

      <form action={addSectionAction.bind(null, courseId)} className="flex items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <Label>New section title</Label>
          <Input name="title" required placeholder="e.g. Module 3: Revenue Recognition" />
        </div>
        <Button type="submit">Add section</Button>
      </form>
    </div>
  );
}
