"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CourseFilters({
  initialQuery,
  initialCategory,
  categories,
}: {
  initialQuery: string;
  initialCategory: string;
  categories: string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  function navigate(nextQ: string, nextCategory: string) {
    const params = new URLSearchParams();
    if (nextQ) params.set("q", nextQ);
    if (nextCategory && nextCategory !== "all") params.set("category", nextCategory);
    router.push(`/courses${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      className="mb-8 flex flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(q, category);
      }}
    >
      <Input
        placeholder="Search courses..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        value={category}
        onValueChange={(v) => {
          const next = v ?? "all";
          setCategory(next);
          navigate(q, next);
        }}
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="secondary">
        Search
      </Button>
    </form>
  );
}
