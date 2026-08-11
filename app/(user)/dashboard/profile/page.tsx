import { ProfileCard } from "@/components/dashboard/ProfileCard";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      <ProfileCard />
    </div>
  );
}
