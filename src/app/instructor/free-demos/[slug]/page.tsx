import { FreeDemoDetailContent } from "@/components/portal/free-demo-detail-content";

export const dynamic = "force-dynamic";

export default async function FreeDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <FreeDemoDetailContent basePath="/instructor" slug={slug} />;
}
